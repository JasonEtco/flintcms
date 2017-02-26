const {
  GraphQLNonNull,
  GraphQLID,
} = require('graphql');
const mongoose = require('mongoose');
const EntryType = require('../../types/Entries');
const getProjection = require('../../get-projection');

const Entry = mongoose.model('Entry');


module.exports = {
  type: EntryType,
  args: {
    _id: {
      name: '_id',
      type: new GraphQLNonNull(GraphQLID),
    },
  },
  async resolve(root, params, options) {
    const projection = getProjection(options.fieldASTs[0]);
    const removedEntry = await Entry
      .findByIdAndRemove(params._id, { select: projection })
      .exec();

    if (!removedEntry) {
      throw new Error('Error removing blog post');
    }

    return removedEntry;
  },
};
