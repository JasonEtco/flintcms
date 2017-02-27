const {
  GraphQLNonNull,
} = require('graphql');
const mongoose = require('mongoose');
const { inputType, outputType } = require('../../types/Entries');
const h = require('../../../utils/helpers');


const Entry = mongoose.model('Entry');

module.exports = {
  type: new GraphQLNonNull(outputType),
  args: {
    data: {
      name: 'data',
      type: new GraphQLNonNull(inputType),
    },
  },
  async resolve(root, params) {
    const entry = new Entry(params.data);

    entry.slug = h.slugify(params.data.title);
    entry.dateCreated = Date.now();

    const newEntry = await entry.save();

    if (!newEntry) {
      throw new Error('Error adding new blog post');
    }
    return newEntry;
  },
};
