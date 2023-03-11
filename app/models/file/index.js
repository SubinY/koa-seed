const mongoose = require('mongoose');

const Schema = new mongoose.Schema(
  {
    id: {
      type: Number,
      unique: true,
      require: true,
    },
    path: {
      type: String,
      require: true,
    },
    type: {
      type: String,
    },
    name: {
      type: String,
    },
    extension: {
      type: String,
    },
    size: {
      type: Number,
    },
    md5: {
      type: String,
    },
  },
  { versionKey: false },
);

Schema.index({ id: 1 });

const File = mongoose.model('File', Schema, 'file');

module.exports = {
  FileModel: File,
};
