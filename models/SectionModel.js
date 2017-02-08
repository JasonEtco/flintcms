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
  entries: [{
    type: Schema.Types.ObjectId,
    ref: 'Entry',
  }],
  dateCreated: {
    type: Date,
    required: true,
  },
});

module.exports = mongoose.model('Section', SectionSchema, 'sections');
