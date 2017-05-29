const mongoose = require('mongoose');
const h = require('../utils/helpers');

const Schema = mongoose.Schema;

const SectionSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  slug: {
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
  fields: [{
    type: Schema.Types.ObjectId,
    ref: 'Field',
  }],
});

SectionSchema.name = 'Section';

// Can't use arrow function because of (this) binding
// eslint-disable-next-line func-names
SectionSchema.pre('validate', function (next) {
  this.slug = h.slugify(this.title);
  next();
});

module.exports = mongoose.model('Section', SectionSchema, 'sections');
