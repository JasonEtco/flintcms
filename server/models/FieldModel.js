const mongoose = require('mongoose');
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
  instructions: {
    type: String,
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
    default: Date.now,
  },
});

FieldSchema.pre('validate', function (next) {
  this.slug = h.slugify(this.title);
  next();
});

module.exports = mongoose.model('Field', FieldSchema, 'fields');
