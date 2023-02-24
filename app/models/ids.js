'use strict';

import mongoose from 'mongoose';

// 递增模型记录
const IdsSchema = new mongoose.Schema({
  admin_id: Number,
  user_id: Number,
  role_group_id: Number,
  permission_id: Number
});

const Ids = mongoose.model('Ids', IdsSchema, 'ids');

Ids.findOne((err, data) => {
  if (!data) {
    const newIds = new Ids({
      user_id: 0,
      admin_id: 0,
      role_group_id: 0,
      permission_id: 0
    });
    newIds.save();
  }
});

module.exports = Ids;
