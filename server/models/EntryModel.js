const mongoose = require('mongoose');
const h = require('../utils/helpers');

const Schema = mongoose.Schema;

const EntrySchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  section: {
    type: Schema.Types.ObjectId,
    ref: 'Section',
    required: true,
  },
  slug: {
    type: String,
    required: true,
    unique: true,
  },
  fields: [{
    fieldId: {
      type: Schema.Types.ObjectId,
      ref: 'Field',
      required: true,
    },
    fieldSlug: {
      type: String,
      required: true,
    },
    value: {
      type: String,
      required: true,
    },
  }],
  dateCreated: {
    type: Date,
    default: Date.now,
  },
  author: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
});

EntrySchema.pre('validate', function (next) {
  this.slug = h.slugify(this.title);
  next();
});

module.exports = mongoose.model('Entry', EntrySchema, 'entries');
