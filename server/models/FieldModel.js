const mongoose = require('mongoose');
const camelcase = require('camelcase');
const h = require('../utils/helpers');

const Schema = mongoose.Schema;

const FieldSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  slug: {
    type: String,
    required: true,
    unique: true,
  },
  handle: {
    type: String,
    required: true,
    unique: true,
  },
  instructions: {
    type: String,
  },
  type: {
    type: String,
    required: true,
  },
  required: {
    type: Boolean,
    required: true,
  },
  options: {
    type: Schema.Types.Mixed,
  },
  dateCreated: {
    type: Date,
    default: Date.now,
  },
});

// Can't use arrow function because of (this) binding
// eslint-disable-next-line func-names
FieldSchema.pre('validate', function (next) {
  this.slug = h.slugify(this.title);
  this.handle = camelcase(this.title);
  next();
});

module.exports = mongoose.model('Field', FieldSchema, 'fields');
