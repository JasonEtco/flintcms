const {
  GraphQLNonNull,
  GraphQLBoolean,
} = require('graphql');
const mongoose = require('mongoose');
const createInputObject = require('../../../utils/createInputObject');
const EntryType = require('../../types/Entries');

const Entry = mongoose.model('Entry');

module.exports = {
  type: GraphQLBoolean,
  args: {
    data: {
      name: 'data',
      type: new GraphQLNonNull(createInputObject(EntryType)),
    },
  },
  async resolve(root, params, options) {
    const entry = new Entry(params.data);
    const newEntry = await entry.save();

    if (!newEntry) {
      throw new Error('Error adding new blog post');
    }
    return true;
  },
};
