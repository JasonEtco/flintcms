const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const AssetSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  extension: {
    type: String,
    required: true,
  },
  filename: {
    type: String,
    required: true,
  },
  dateCreated: {
    type: Date,
    default: Date.now,
  },
  width: {
    type: Number,
    required: true,
  },
  height: {
    type: Number,
    required: true,
  },
  filesize: {
    type: Number,
    required: true,
  },
  mimetype: {
    type: String,
    required: true,
  },
});

AssetSchema.pre('validate', function (next) {
  const ext = this.filename.split(/[\s.]+/);
  this.extension = ext[ext.length - 1];
  next();
});

module.exports = mongoose.model('Asset', AssetSchema, 'assets');
