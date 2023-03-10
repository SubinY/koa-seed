const { get, isArray, unset, cloneDeep } = require('lodash');
const { ParametersException, HttpException } = require('../exception');
const validator1 = require('validator');
const { extendedValidator } = require('./extended-validator');
const { getAllMethodNames, getAllFieldNames } = require('./utils');

/**
 * 强大的校验器
 * 支持optional，支持array，支持nested object
 */
class LinValidator {
  constructor() {
    /**
     * 装载数据的容器
     */
    this.data = {};

    /**
     * 解析后的数据容器
     */
    this.parsed = {};

    /**
     * 数据校验错误容器
     */
    this.errors = [];

    /**
     * 别名
     */
    this.alias = null;
  }

  /**
   * 校验
   * @param ctx koa context
   * @param alias 别名
   */
  async validate(ctx, alias) {
    this.alias = alias;
    this.data = {
      body: ctx.request.body,
      query: ctx.request.query,
      path: ctx.params,
      header: ctx.request.header
    };
    const tmpData = cloneDeep(this.data);
    this.parsed = {
      ...tmpData,
      default: {}
    };
    if (!(await this.checkRules())) {
      let obj = {};
      if (this.errors.length === 1) {
        obj = this.errors[0].message;
      } else {
        for (const err of this.errors) {
          obj[err.key] = err.message;
        }
      }
      throw new ParametersException({ message: obj });
    } else {
      ctx.v = this;
      return this;
    }
  }

  replace(keys) {
    // key 是原来的名字
    if (!this.alias) {
      return keys;
    }
    let arr = [];
    for (let key of keys) {
      if (this.alias[key]) {
        this[this.alias[key]] = this[key];
        unset(this, key);
        arr.push(this.alias[key]);
      } else {
        arr.push(key);
      }
    }
    return arr;
  }

  isOptional(val) {
    // undefined , null , ""  , "    ", 皆通过
    if (val === void 0) {
      return true;
    }
    if (val === null) {
      return true;
    }
    if (typeof val === 'string') {
      return val === '' || val.trim() === '';
    }
    return false;
  }

  async checkRules() {
    // 筛选出是Rule或Rules的key
    // 添加规则校验 validateKey
    // default校验规则 throw
    let keys = getAllFieldNames(this, {
      filter: (key) => {
        const value = this[key];
        if (isArray(value)) {
          if (value.length === 0) {
            return false;
          }
          for (const it of value) {
            if (!(it instanceof Rule)) {
              throw new Error('every item must be a instance of Rule');
            }
          }
          return true;
        } else {
          return value instanceof Rule;
        }
      }
    });
    // 此处进行别名替换
    keys = this.replace(keys);
    for (const key of keys) {
      // 标志位
      let stoppedFlag = false;
      let optional = false;
      const value = this[key];
      let defaultVal;
      // 如果没有传入这个参数，检查这个校验链中是否有 isOptional 如果有通过，否则抛异常
      // 去data下找key，二级目录查找 dataKey 为一级目录的路径
      const [dataKey, dataVal] = this.findInData(key);
      if (this.isOptional(dataVal)) {
        let message;
        if (isArray(value)) {
          for (const it of value) {
            if (it.optional) {
              defaultVal = it.defaultValue && it.defaultValue;
              optional = true;
            } else {
              if (!message) {
                message = it.message;
              }
            }
          }
        } else {
          if (value.optional) {
            defaultVal = value.defaultValue && value.defaultValue;
            optional = true;
          } else {
            message = value.message;
          }
        }
        // 没有 isOptional 抛异常
        // 有 isOptional 取它的默认值
        if (!optional) {
          this.errors.push({ key, message: message || `${key}不可为空` });
        } else {
          this.parsed['default'][key] = defaultVal;
        }
      } else {
        if (isArray(value)) {
          const errs = [];
          for (const it of value) {
            // 当rule的optional为false时，进行校验
            if (!stoppedFlag && !it.optional) {
              let valid;
              valid = await it.validate(this.data[dataKey][key]);
              if (!valid) {
                errs.push(it.message);
                // 如果当前key已有错误，则置stoppedFlag为true，后续会直接跳过校验
                stoppedFlag = true;
              }
            }
            if (it.parsedValue !== void 0) {
              this.parsed[dataKey][key] = it.parsedValue;
            }
          }
          if (errs.length !== 0) {
            this.errors.push({ key, message: errs });
          }
        } else {
          const errs = [];
          if (!stoppedFlag && !value.optional) {
            let valid;
            valid = await value.validate(this.data[dataKey][key]);
            if (!valid) {
              errs.push(value.message);
              // 如果当前key已有错误，则置stoppedFlag为true，后续会直接跳过校验
              stoppedFlag = true;
            }
          }
          if (value.parsedValue !== void 0) {
            this.parsed[dataKey][key] = value.parsedValue;
          }
          if (errs.length !== 0) {
            this.errors.push({ key, message: errs });
          }
        }
      }
    }
    let validateFuncKeys = getAllMethodNames(this, {
      filter: (key) =>
        /validate([A-Z])\w+/g.test(key) && typeof this[key] === 'function'
    });

    for (const validateFuncKey of validateFuncKeys) {
      //  最后校验规则函数
      const customerValidateFunc = get(this, validateFuncKey);
      // 规则函数，每个都try,catch，并将错误信息加入到整体错误信息中
      // 第一个参数为data
      // 自定义校验函数，第一个参数是校验是否成功，第二个参数为错误信息
      let validRes;
      try {
        validRes = await customerValidateFunc.call(this, this.data);
        if (isArray(validRes) && !validRes[0]) {
          let key;
          if (validRes[2]) {
            key = validRes[2];
          } else {
            key = this.getValidateFuncKey(validateFuncKey);
          }
          this.errors.push({ key, message: validRes[1] });
        } else if (!validRes) {
          let key = this.getValidateFuncKey(validateFuncKey);
          // 如果自定函数没有给出错误信息，那么错误信息为默认
          this.errors.push({ key, message: '参数错误' });
        }
      } catch (error) {
        const key = this.getValidateFuncKey(validateFuncKey);
        if (error instanceof HttpException) {
          this.errors.push({ key, message: error.message });
        } else {
          this.errors.push({ key, message: error.message });
        }
      }
    }
    return this.errors.length === 0;
  }

  /**
   * 获得规则函数的key
   * @param validateFuncKey 规则函数的名称
   */
  getValidateFuncKey(validateFuncKey) {
    return validateFuncKey.replace('validate', '');
  }

  /**
   *  取参数里的值；如果参数不能被解析，则返回没有被解析的值
   * @param path 参数所在的路径，如 a.b
   * @param parsed 是否取已经解析后的数据，默认为true
   * @param defaultVal 默认值，当路径指向的值不存在，取默认值
   */
  get(path, parsed = true) {
    let defaultVal;
    if (arguments.length >= 3) {
      defaultVal = arguments[2];
    }
    if (parsed) {
      const key = get(this.parsed, path, defaultVal && defaultVal);
      if (!this.isOptional(key)) {
        return key;
      } else {
        const index = path.lastIndexOf('.');
        const suffix = path.substring(index + 1, path.length);
        return get(this.parsed['default'], suffix, defaultVal && defaultVal);
      }
    } else {
      return get(this.data, path, defaultVal && defaultVal);
    }
  }

  findInData(key) {
    const keys = Object.keys(this.data);
    for (const k of keys) {
      const val = get(this.data[k], key);
      if (val !== void 0) {
        return [k, val];
      }
    }
    return [];
  }
}

/**
 * 规则类
 */
class Rule {
  constructor(validateFunction, message, ...options) {
    this.options = null;
    this.message = null;
    this.validateFunction = null;
    this.optional = false;
    this.parsedValue = null;
    this.rawValue = null;
    this.defaultValue = null;

    this.validateFunction = validateFunction;
    this.message = message || '参数错误';
    this.options = options;
    if (this.validateFunction === 'isOptional') {
      // 如果当前项为optional，检查该项是否存在，若不存在，将optional置为true
      // 如果是optional，那么没有传入的参数，可以使用默认值
      this.optional = true;
      this.defaultValue = options && options[0];
    }
  }

  validate(value) {
    this.rawValue = value;
    if (typeof this.validateFunction === 'function') {
      return this.validateFunction(value, ...this.options);
    } else {
      switch (this.validateFunction) {
        case 'isInt':
          if (typeof value === 'string') {
            this.parsedValue = validator1.toInt(value);
            return validator1.isInt(value, ...this.options);
          } else {
            this.parsedValue = value;
            return validator1.isInt(String(value), ...this.options);
          }
        case 'isFloat':
          if (typeof value === 'string') {
            this.parsedValue = validator1.toFloat(value);
            return validator1.isFloat(value, ...this.options);
          } else {
            this.parsedValue = value;
            return validator1.isFloat(String(value), ...this.options);
          }
        case 'isBoolean':
          if (typeof value === 'string') {
            this.parsedValue = validator1.toBoolean(value);
            return validator1.isBoolean(value);
          } else {
            this.parsedValue = value;
            return validator1.isBoolean(String(value));
          }
        case 'isNotEmpty':
          return !validator1.isEmpty(value);
        default:
          return validator1[this.validateFunction](value, ...this.options);
      }
    }
  }
}

module.exports = {
  LinValidator,
  Rule
};
