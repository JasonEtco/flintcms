const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const EntrySchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  template: {
    type: String,
    required: true,
  },
  slug: {
    type: String,
    required: true,
  },
  body: {
    type: String,
  },
  dateCreated: {
    type: Date,
    required: true,
  },
});

module.exports = mongoose.model('Entry', EntrySchema, 'entries');
