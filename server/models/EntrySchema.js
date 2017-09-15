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
    handle: {
      type: String,
      required: true,
    },
    value: {
      type: Schema.Types.Mixed,
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

EntrySchema.name = 'Entry';

// Can't use arrow function because of (this) binding
// eslint-disable-next-line func-names
EntrySchema.pre('validate', function (next) {
  const slug = h.slugify(this.title);

  if (slug === '') {
    next(new Error('Your entry\'s title must have some real characters'));
    return;
  }

  this.slug = slug;
  next();
});

// eslint-disable-next-line func-names
EntrySchema.methods.getTemplate = async function ({ section }) {
  const Section = mongoose.model('Section');
  const foundSection = await Section.findById(section).select('template').lean();
  if (!foundSection) throw new Error('The Section could not be found');

  return foundSection.template;
};

// eslint-disable-next-line func-names
EntrySchema.methods.getUrl = async function ({ section, slug }) {
  const Section = mongoose.model('Section');
  const foundSection = await Section.findById(section).select('slug').lean();
  if (!foundSection) throw new Error('The Section could not be found');

  return `/${foundSection.slug}/${slug}`;
};

module.exports = EntrySchema;
