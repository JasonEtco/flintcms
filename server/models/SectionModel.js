const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const SectionSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  slug: {
    type: String,
    required: true,
  },
  template: {
    type: String,
    required: true,
  },
  dateCreated: {
    type: Date,
    required: true,
  },
  fields: [{
    type: Schema.Types.ObjectId,
    ref: 'Field',
  }],
});

module.exports = mongoose.model('Section', SectionSchema, 'sections');
