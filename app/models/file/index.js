const mongoose = require('mongoose');

const Schema = new mongoose.Schema(
  {
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

const File = mongoose.model('File', Schema, 'file');

module.exports = {
  FileModel: File,
};
