const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const FieldSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  slug: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
  options: {
    type: Schema.Types.Mixed,
  },
  dateCreated: {
    type: Date,
    required: true,
  },
});

module.exports = mongoose.model('Field', FieldSchema, 'fields');
