// const mongoose = require('mongoose');
// const initDBData = require('../../utils/initDBData');
import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      require: true,
      unique: true,
      comment: '初始化数据库必须插入id'
    },
    user_name: String,
    password: {
      type: String,
      select: false
    },
    avatar: {
      type: String,
      default: ''
    },
    sex: {
      type: String,
      default: ''
    },
    desc: {
      type: String,
      default: ''
    },
    phone: {
      type: String,
      default: ''
    },
    email: {
      type: String,
      default: ''
    }
  },
  { versionKey: false }
);

UserSchema.index({ id: 1 });

const User = mongoose.model('User', UserSchema, 'user');

// module.exports = User;
export default User;
