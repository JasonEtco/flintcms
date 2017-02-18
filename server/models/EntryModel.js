const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const EntrySchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  section: {
    type: Schema.Types.ObjectId,
    ref: 'Section',
  },
  slug: {
    type: String,
    required: true,
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
    required: true,
  },
  author: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
}, { strict: false });

module.exports = mongoose.model('Entry', EntrySchema, 'entries');
