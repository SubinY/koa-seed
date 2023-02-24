const mongoose = require('mongoose');
const shortid = require('shortid');
const { initDBData, initPermissionJson } = require('../../utils/initDBData');

// 路由权限
const Schema = new mongoose.Schema(
  {
    id: {
      type: Number,
      unique: true,
      require: true,
      default: shortid.generate,
    },
    module: {
      type: String,
      comment: '权限所属模块',
    },
    name: {
      type: String,
      comment: '权限名称',
    },
    parent_id: {
      type: Number,
    },
    desc: {
      type: String,
      comment: '权限描述',
    },
    uri: {
      type: String,
      comment: '权限URI',
    },
    type: {
      type: String,
      comment: '路由(page)、按钮(button)、接口(api)',
    },
    mount: {
      type: Boolean,
    },
  },
  { versionKey: false },
);

Schema.index({ id: 1 });

const Permission = mongoose.model('Permission', Schema, 'permission');

initPermissionJson(() => initDBData(Permission));

module.exports = {
  PermissionModel: Permission,
};
