const mongoose = require('mongoose');

// 角色分组
const Schema = new mongoose.Schema(
  {
    role_id: {
      type: String,
      require: true,
      unique: true,
      comment: '角色id'
    },
    role_name: {
      type: String,
      require: true,
      unique: true,
      comment: '角色名称'
    },
    desc: {
      type: String,
      comment: '角色描述'
    },
    role_permission: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Permission'
    }
  },
  { versionKey: false }
);

const AdminRole = mongoose.model('AdminRole', Schema, 'adminRole');

module.exports = {
  AdminRoleModel: AdminRole
};
