const { Validator: BaseValidator } = require('class-validator');
const { has, get } = require('lodash');
const validator1 = require('validator');

// /**
//  * IsFloat的参数可选项
//  */
// interface IsFloatOptions {
//   min?: number;
//   max?: number;
//   gt?: number;
//   lt?: number;
// }

// /**
//  * IsInt的参数可选项
//  */
// interface IsIntOptions {
//   min?: number;
//   max?: number;
//   allow_leading_zeroes?: boolean;
//   lt?: number;
//   gt?: number;
// }

/**
 * Validator扩展类
 */
class ExtendedValidator extends BaseValidator {
  /**
   * 检查一个object是否具有某个属性
   * @param obj
   * @param path
   *
   * ```js
   * hasProperty({a:"l"},"a")
   * ```
   */
  hasProperty(obj, path) {
    return has(obj, path);
  }

  /**
   * 检查一个object的某个属性是否为空
   * @param obj
   * @param path
   *
   * ```js
   * objPropertyIsNotEmpty({ a : { b: "c" }, "a.b" })
   * ```
   */
  objPropertyIsNotEmpty(obj, path) {
    if (!this.hasProperty(obj, path)) {
      return false;
    }
    return !validator1.isEmpty(get(obj, path));
  }

  /**
   * 检查一个object的多个属性是否为空
   * @param obj
   * @param paths
   *
   * ```js
   * objPropertiesIsNotEmpty({a: {b:"c", d: "e"}}, ["a.b","a.d"])
   * ```
   */
  objPropertiesIsNotEmpty(obj, paths) {
    for (const path of paths) {
      if (!this.hasProperty(obj, path)) {
        return false;
      }
      if (validator1.isEmpty(get(obj, path))) {
        return false;
      }
    }
    return true;
  }

  /**
   * 字符串转int
   * @param input 输入字符串
   * @param radix 精度
   */
  toInt(input, radix) {
    return validator1.toInt(input, radix);
  }

  /**
   * 字符串转float
   * @param input 输入字符串
   */
  toFloat(input) {
    return validator1.toFloat(input);
  }

  /**
   * 字符串转boolean
   * @param input 输入字符串
   */
  toBoolean(input) {
    return validator1.toBoolean(input);
  }

  /**
   * 字符串转Date
   * @param input 输入字符串
   */
  toDate(input) {
    return validator1.toDate(input);
  }

  /**
   * 检查字符串是否为float
   * @param str 输入字符串
   * @param options 参数项
   */
  isFloat(str, options) {
    return validator1.isFloat(str, options);
  }

  /**
   * 检查number是否为float
   * @param input 输入number
   * @param options 参数项
   */
  isFloat2(input, options) {
    return validator1.isFloat(input + '', options);
  }

  /**
   * 检查字符串是否为int
   * @param str 输入字符串
   * @param options 参数项
   */
  isInt2(str, options) {
    return validator1.isInt(str, options);
  }

  /**
   * 检查number是否为int
   * @param input 输入number
   * @param options 参数项
   */
  isInt3(input, options) {
    return validator1.isInt(input + '', options);
  }
}

/**
 * 全局的校验器
 */
const extendedValidator = new ExtendedValidator();

module.exports = {
  ExtendedValidator,
  extendedValidator
};
