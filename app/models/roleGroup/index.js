const mongoose = require('mongoose');
const shortid = require('shortid');
const initDBData = require('../../utils/initDBData');

// 角色分组
const Schema = new mongoose.Schema(
  {
    id: {
      type: Number,
      unique: true,
      require: true
    },
    role_group_name: {
      type: String,
      require: true,
      unique: true,
      comment: '角色名称'
    },
    desc: {
      type: String,
      comment: '角色描述'
    },
    permission: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Permission'
    }
  },
  { versionKey: false }
);

const RoleGroup = mongoose.model('RoleGroup', Schema, 'roleGroup');

// initDBData(RoleGroup);

module.exports = {
  RoleGroupModel: RoleGroup
};
