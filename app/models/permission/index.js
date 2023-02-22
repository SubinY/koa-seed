const mongoose = require('mongoose');
const shortid = require('shortid');
const initDBData = require('../../utils/initDBData');

// 路由权限
const Schema = new mongoose.Schema(
  {
    id: {
      type: Number,
      unique: true,
      require: true,
      default: shortid.generate
    },
    module: {
      type: String,
      comment: '权限所属模块',
      default: 'root'
    },
    name: {
      type: String,
      require: true,
      unique: true,
      comment: '权限名称'
    },
    uri: {
      type: String,
      comment: '权限URI'
    },
    type: {
      type: String,
      comment: '路由(page)、按钮(button)、其他(other)'
    },
    mount: {
      type: Boolean
    }
  },
  { versionKey: false }
);

const Permission = mongoose.model('Permission', Schema, 'permission');

initDBData(Permission);

module.exports = {
  PermissionModel: Permission
};
