const {
  Novel
} = require("../models/novel");
const crud = require("./crudUtil");
const fs = require("fs");
const {
  v4: uuidv4
} = require("uuid");
const {
  isAdmin
} = require("./authUtils");

/// 格式化小说
function handleNovel(string) {
  return new Promise((resolve) => {
    const titleReg = /(^\s*第)(.*)[章节卷集部篇回](\s*)(.*)(\n|\r|\r\n)/gm;
    result = string.match(titleReg);
    console.log('result结果==>', result)
    const keyWords = [];
    const keyWordsIndexArray = [];
    for (let index = 0; index < result.length; index++) {
      let element = result[index];
      const newKey = element.replace(/\s+/g, "");
      keyWords.push({
        newKey,
        id: uuidv4()
      });
      const keyWordsIndex = string.indexOf(element);
      keyWordsIndexArray.push(keyWordsIndex);
    }
    const resultArray = [];
    for (let index = 0; index < keyWordsIndexArray.length; index++) {
      const pre = keyWordsIndexArray[index];
      const current = keyWordsIndexArray[index + 1];
      //   console.log("结果😀😀😀===>", pre);
      //   console.log("结果😀😀😀===>", current);
      const obj = {
        title: "",
        content: "",
        id: keyWords[index].id,
      };
      obj.title = keyWords[index].newKey;
      const preLength = result[index].length;

      //   console.log("结果😀😀😀===>", result[index].length);
      if (pre >= 0) {
        obj.content = string.slice(pre, current);
      } else {
        obj.content = string.slice(0, current);
      }
      obj.content = obj.content.slice(preLength);
      resultArray.push(obj);
    }
    // console.log("结果😀😀😀===>", resultArray);
    resolve({
      keyWords,
      resultArray
    });
    return {
      keyWords,
      resultArray
    };
  });
}

// 添加小说
const add = async (ctx) => {
  console.log("ctx.request.files结果===>", ctx.request.files);
  const {
    file: {
      filepath,
      originalFilename
    },
  } = ctx.request.files;
  const name = originalFilename.split(".")[0];
  //   console.log("file结果😀😀😀===>", filepath);
  const data = fs.readFileSync(filepath, "utf-8");
  const {
    keyWords,
    resultArray
  } = await handleNovel(data);
  await crud.add(
    Novel, {
      name,
      catalog: keyWords,
      content: resultArray,
    },
    ctx
  );
};

const update = async (ctx) => {
  const {
    username
  } = await isAdmin(ctx);
  // console.log('username结果===>',username)
  const {
    _id,
    name,
    color
  } = ctx.request.body;
  await crud.update(
    Novel, {
      _id,
    }, {
      name,
      color,
      creator: username,
    },
    ctx
  );
};

const del = async (ctx) => {
  const {
    _id
  } = ctx.request.body;
  await crud.del(
    Novel, {
      _id,
    },
    ctx
  );
};

const detail = async (ctx) => {
  const {
    id,
    name
  } = ctx.query;
  console.log("ctx.params结果===>", ctx.query.id);
  await Novel.aggregate([{
        $match: {
          "content.id": id,
        },
      },
      {
        $replaceWith: {
          $arrayElemAt: [{
              $filter: {
                input: "$content",
                cond: {
                  $eq: ["$$this.id", id]
                },
              },
            },
            0,
          ],
        },
      },
    ])
    .then((res) => {
      if (res) {
        ctx.body = {
          code: 200,
          msg: "操作成功",
          data: res,
        };
      } else {
        ctx.body = {
          code: 500,
          msg: "没找到您要的数据",
        };
      }
    })
    .catch((err) => {
      ctx.body = {
        code: 501,
        msg: "操作异常",
      };
      console.log("err===>", err);
    });
};

const list = async (ctx) => {
  const {
    name = '', pageIndex = 1, pageSize = 1
  } = ctx.query;
  const index = parseInt(pageIndex) - 1
  const size = parseInt(pageSize)
  console.log('pageIndex结果==>', index * size)
  console.log('pageSize结果==>', index * size + size)
  await Novel.aggregate([{
        $match: {
          name: {
            $regex: name
          }
        },
      },
      {
        $project: {
          catalog: {
            $slice:['$catalog',index * size, size]
          },
          name: 1,
          // names:'$name'
          total: {
            $size: '$catalog'
          }
        }
      },
    ])
    .then((res) => {
      if (res) {
        ctx.body = {
          code: 200,
          msg: "操作成功",
          data: res,
        };
      } else {
        ctx.body = {
          code: 500,
          msg: "没找到您要的数据",
        };
      }
    })
    .catch((err) => {
      ctx.body = {
        code: 501,
        msg: "操作异常",
      };
      console.log("err===>", err);
    });
};

const batch = async (ctx) => {
  // const {
  //     type
  // } = ctx.request.body
  await crud.updateMany(
    Novel, {}, {
      color: "#ffffff",
    },
    ctx
  );
};
// batch()

module.exports = {
  add,
  list,
  del,
  detail,
};