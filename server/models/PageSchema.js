const mongoose = require('mongoose');
const camelcase = require('camelcase');
const h = require('../utils/helpers');

const Schema = mongoose.Schema;

const PageSchema = new Schema({
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
  template: {
    type: String,
    required: true,
  },
  dateCreated: {
    type: Date,
    default: Date.now,
  },
  fieldLayout: [{
    type: Schema.Types.ObjectId,
    ref: 'Field',
  }],
  fields: [{
    fieldId: {
      type: Schema.Types.ObjectId,
      ref: 'Field',
      required: true,
    },
    handle: {
      type: String,
      required: true,
    },
    value: {
      type: Schema.Types.Mixed,
      required: true,
    },
  }],
  homepage: {
    type: Boolean,
    default: false,
  },
  route: {
    type: String,
    required: true,
  },
});

PageSchema.name = 'Page';

// Can't use arrow function because of (this) binding
// eslint-disable-next-line func-names
PageSchema.pre('validate', function (next) {
  this.slug = h.slugify(this.title);
  this.handle = camelcase(this.title);
  next();
});

module.exports = PageSchema;
