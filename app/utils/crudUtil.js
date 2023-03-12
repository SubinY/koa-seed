const json = require('koa-json');
const config = require('../utils/config');
const { DEFAULT_PAGE_INDEX, DEFAULT_PAGE_SIZE } = require('../const');

const CodeMessage = config.getItem('codeMessage', {});

/**
 * 去除对象中的空值
 * @param {Object} o
 */
function toType(obj) {
  return {}.toString
    .call(obj)
    .match(/\s([a-zA-Z]+)/)[1]
    .toLowerCase();
}
function clearEmpty(o) {
  for (let key in o) {
    // console.log('o[key]结果===>',o[key])
    if (
      !o[key] ||
      o[key] === null ||
      o[key] === '' ||
      o[key] === undefined ||
      o[key] === '[]'
    ) {
      delete o[key];
    }
    if (toType(o[key]) === 'string') {
      o[key] = o[key].trim();
    } else if (toType(o[key]) === 'object') {
      o[key] = clearEmpty(o[key]);
    } else if (toType(o[key]) === 'array') {
      o[key] = o[key].filter((item) => item.trim());
      o[key] = clearEmpty(o[key]);
      o[key] = { $all: o[key] };
    }
  }
  // console.log('o结果===>',o)
  return o;
}

/**
 * 添加公共方法
 * @param {*} model 模型
 * @param {*} where 参数
 * @param {*} ctx 上下文
 * @returns
 */
const add = async (model, where, ctx) => {
  let isDouble = false;
  await model.findOne(where).then((res) => {
    if (res) isDouble = true;
  });
  if (isDouble) {
    return (ctx.body = {
      code: 500,
      msg: '内容重复！已拒绝'
    });
  }
  return model
    .create(where)
    .then((res) => {
      if (res) {
        ctx.body = {
          code: 200,
          msg: '操作成功',
          data: null
        };
      } else {
        ctx.body = {
          code: 500,
          msg: '操作失败',
          data: null
        };
      }
    })
    .catch((err) => {
      ctx.body = {
        code: 501,
        msg: '操作异常'
      };
      console.log('err===>', err);
    });
};

/**
 * 编辑公共方法
 * @param {*} model
 * @param {*} where
 * @param {*} ctx
 * @returns
 */
const update = (model, where, params, ctx) => {
  console.log('where结果===>', where);
  return model
    .updateOne(where, params)
    .then((res) => {
      if (res.modifiedCount === 1) {
        ctx.body = {
          code: 200,
          msg: '操作成功'
        };
      } else {
        ctx.body = {
          code: 500,
          msg: '操作失败'
        };
      }
    })
    .catch((err) => {
      ctx.body = {
        code: 501,
        msg: '操作异常'
      };
      console.log('err===>', err);
    });
};

/**
 * 删除公共方法
 * @param {*} model
 * @param {*} where
 * @param {*} ctx
 * @returns
 */
const del = (model, where, ctx) => {
  return model
    .findOneAndDelete(where)
    .then((res) => {
      if (res) {
        ctx.body = {
          code: 200,
          msg: CodeMessage.getMessage(200)
          // data:res
        };
      } else {
        ctx.body = {
          code: 500,
          msg: CodeMessage.getMessage(500)
        };
      }
    })
    .catch((err) => {
      ctx.body = {
        code: 501,
        msg: '操作异常'
      };
      console.log('err===>', err);
    });
};
/**
 * 批量更新字段公共方法
 * @param {*} model
 * @param {*} where
 * @param {*} ctx
 * @returns
 */
const updateMany = (model, where, params, ctx) => {
  return model
    .updateMany(where, params)
    .then((res) => {
      if (res) {
        ctx.body = {
          code: 200,
          msg: '操作成功'
          // data:res
        };
      } else {
        ctx.body = {
          code: 500,
          msg: '操作失败'
        };
      }
    })
    .catch((err) => {
      ctx.body = {
        code: 501,
        msg: '操作异常'
      };
      console.log('err===>', err);
    });
};

/**
 * 详情公共方法
 * @param {*} model
 * @param {*} where
 * @param {*} ctx
 * @returns
 */
const detail = async (model, where, ctx) => {
  // 传入参数数量不固定,去掉无效参数
  clearEmpty(where);
  try {
    const res = await model.findOne(where, '-_id');
    ctx.body = {
      code: 200,
      msg: '操作成功',
      data: res
    };
  } catch (error) {
    throw new Error(error);
  }
};

/**
 * 用于分页查询的公共方法
 * @param {*} model
 * @param {*} where 参数
 * @param {*} ctx
 * @returns
 */

const find = (model, where, ctx) => {
  const {
    pageIndex = DEFAULT_PAGE_INDEX,
    pageSize = DEFAULT_PAGE_SIZE
  } = ctx.query;
  // console.log('ctx.params结果===>', ctx.query)
  console.log(
    '原始列表查询条件where结果===>',
    JSON.stringify(where),
    ctx.query
  );

  clearEmpty(where);
  console.log('列表查询条件where结果===>', JSON.stringify(where));
  return model
    .find(where)
    .skip((+pageIndex - 1) * +pageSize || 0)
    .limit(+pageSize || 0)
    .then((res) => {
      if (res) {
        ctx.body = {
          code: 200,
          msg: '操作成功',
          data: {
            list: res,
            total: res.length || 0,
            pageIndex: +pageIndex,
            pageSize: +pageSize
          }
        };
      } else {
        ctx.body = {
          code: 500,
          msg: '操作失败'
        };
      }
    })
    .catch((err) => {
      ctx.body = {
        code: 501,
        msg: '操作异常'
      };
      console.log('err===>', err);
    });
};

module.exports = {
  add,
  find,
  update,
  del,
  detail,
  updateMany
};
