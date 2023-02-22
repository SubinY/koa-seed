const fs = require('fs');
const path = require('path');

// 转换json，去掉ObjectId( )
function parseJson(fileStr) {
  fileStr = fileStr.replace(/ObjectId\(/g, '').replace(/\)/g, '');
  return JSON.parse(fileStr);
}

// 读取json
function getJson(modelName) {
  try {
    const jsonPath = path.join(__dirname, `../models/${modelName}/data.json`);
    const fileStr = fs.readFileSync(jsonPath, 'utf-8');
    return parseJson(fileStr);
  } catch (err) {
    console.log(err);
  }
  return '';
}

// 以更新的方式插入
async function insertJson(target, data) {
  const result = await target.findOne({ _id: data._id });

  if (result) {
    await target.updateOne({ _id: data._id }, { $set: data });
  } else {
    await target.create(data);
  }
}

async function initDBData(model) {
  let modelName = model.modelName;
  modelName = modelName.charAt(0).toLowerCase() + modelName.slice(1);
  const data = getJson(modelName);
  model.findOne().then(async (res) => {
    if (res) return;
    if (Array.isArray(data)) {
      data.forEach(async (item) => {
        await model.create(item);
      });
    } else {
      await model.create(data);
    }
  });
}

module.exports = initDBData;
