import fs from 'fs';
import path from 'path';
import BaseService from '../service/baseService';
import { flatTree } from './index';

// 转换json，去掉ObjectId( )
function parseJson(fileStr) {
  fileStr = fileStr.replace(/ObjectId\(/g, '').replace(/\)/g, '');
  return JSON.parse(fileStr);
}

// 读取json
function getJson(modelName) {
  try {
    const jsonPath = path.join(process.cwd(), `initData/${modelName}.json`);
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

export async function initDBData(model) {
  let modelName = model.modelName;
  modelName = modelName.charAt(0).toLowerCase() + modelName.slice(1);
  const data = getJson(modelName);
  model.findOne().then(async res => {
    if (res) return;
    if (Array.isArray(data)) {
      data.forEach(async item => {
        await model.create(item);
      });
    } else {
      await model.create(data);
    }
  });
}

export async function initPermissionJson(fn = () => {}) {
  const baseService = new BaseService();
  const manualPermissionPath = path.join(process.cwd(), `/initData/manual-permission.json`);
  const needWritePermissionPath = path.join(process.cwd(), `/initData/permission.json`);

  try {
    const fileStr = fs.readFileSync(manualPermissionPath, 'utf-8');
    const flatData = flatTree(JSON.parse(fileStr));
    const flatDataMap = new Map();

    await baseService.setInitId('permission_id', flatData.length);

    for (let i = 0; i < flatData.length; ++i) {
      const id = i + 1;
      flatData[i] = {
        id,
        ...flatData[i],
      };
      flatDataMap.set(flatData[i]['name'], id);
    }
    // 根据mount找出对应parent_id
    for (let i = 0; i < flatData.length; ++i) {
      flatData[i] = {
        parent_id: flatDataMap.get(flatData[i]['module']) || 0,
        ...flatData[i],
      };
    }
    const isFileExist = fs.existsSync(needWritePermissionPath);
    if (isFileExist) {
      fs.unlinkSync(needWritePermissionPath); //删除文件
    }
    fs.writeFileSync(needWritePermissionPath, JSON.stringify(flatData), 'utf-8');
  } catch (error) {
  } finally {
    fn();
  }
}
