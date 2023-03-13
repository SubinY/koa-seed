const mongoose = require('mongoose');
const shortid = require('shortid');
const { initDBData } = require('../../utils/initDBData');
const md5 = require('md5-node');

const AdminSchema = new mongoose.Schema(
  {
    id: {
      type: Number,
      unique: true,
      require: true,
    },
    user_name: String,
    user_desc: String,
    password: {
      type: String,
      select: false,
      default: md5('123456'),
    },
    avatar: {
      type: String,
      default: '',
    },
    phone: {
      type: String,
      default: '',
    },
    email: {
      type: String,
      default: '',
    },
    role: {
      type: Array,
      default: [],
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    versionKey: false,
  },
);

AdminSchema.index({ id: 1 });
AdminSchema.virtual('roleList', {
  ref: 'RoleGroup',
  localField: 'role',
  foreignField: 'id',
  justOne: false,
});

const Admin = mongoose.model('Admin', AdminSchema, 'admin');

initDBData(Admin);

module.exports = Admin;
