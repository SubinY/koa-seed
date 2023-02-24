const mongoose = require('mongoose');
const { initDBData } = require('../../utils/initDBData');

// 角色分组
const Schema = new mongoose.Schema(
  {
    id: {
      type: Number,
      unique: true,
      require: true
    },
    role_group: {
      type: String,
      require: true,
      unique: true,
      comment: '角色名称'
    },
    role_group_name: {
      type: String,
      comment: '角色描述'
    },
    permission_ids: {
      type: Array,
      default: []
    }
  },
  { versionKey: false }
);

Schema.index({ id: 1 });

const RoleGroup = mongoose.model('RoleGroup', Schema, 'roleGroup');

initDBData(RoleGroup);

module.exports = {
  RoleGroupModel: RoleGroup
};
