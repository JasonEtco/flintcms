const {
  GraphQLNonNull,
} = require('graphql');
const mongoose = require('mongoose');
const { inputType, outputType } = require('../../types/Entries');
const h = require('../../../utils/helpers');

const Entry = mongoose.model('Entry');
const Section = mongoose.model('Section');

module.exports = {
  type: new GraphQLNonNull(outputType),
  args: {
    data: {
      name: 'data',
      type: new GraphQLNonNull(inputType),
    },
  },
  async resolve(root, params) {
    const slug = h.slugify(params.data.title);

    if (!await Section.findById(params.data.section)) {
      throw new Error('That section does not exist.');
    }

    if (await Entry.findOne({ slug })) {
      throw new Error('There is already an entry with that slug.');
    }

    const data = await h.reduceToObj(params.data.fields, 'fieldSlug', 'value', params.data);
    const newEntry = new Entry(data);

    newEntry.dateCreated = Date.now();
    newEntry.slug = slug;

    const savedEntry = await newEntry.save();

    if (!savedEntry) throw new Error('Error adding new blog post');

    root.io.emit('new-entry', savedEntry);
    return savedEntry;
  },
};
