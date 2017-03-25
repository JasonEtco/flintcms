const mongoose = require('mongoose');
const h = require('../utils/helpers');

const Schema = mongoose.Schema;

const Section = mongoose.model('Section');

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
    handle: {
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
  status: {
    type: String,
    enum: ['live', 'draft', 'disabled'],
    default: 'disabled',
  },
});

// Can't use arrow function because of (this) binding
// eslint-disable-next-line func-names
EntrySchema.pre('validate', function (next) {
  this.slug = h.slugify(this.title);
  next();
});

// eslint-disable-next-line func-names
EntrySchema.methods.getTemplate = async function () {
  const section = await Section.findById(this.section).select('template').lean();
  if (!section) throw new Error('The Section could not be found');

  return section.template;
};

// eslint-disable-next-line func-names
EntrySchema.methods.getUrl = async function () {
  const section = await Section.findById(this.section).select('slug').lean();
  if (!section) throw new Error('The Section could not be found');

  return `/${section.slug}/${this.slug}`;
};

module.exports = mongoose.model('Entry', EntrySchema, 'entries');
