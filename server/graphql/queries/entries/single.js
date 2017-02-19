const {
  GraphQLList,
  GraphQLID,
  GraphQLNonNull,
} = require('graphql');
const { Types } = require('mongoose');

const EntryType = require('../../types/Entries');
const getProjection = require('../../get-projection');
const EntryModel = require('../../../models/EntryModel');

module.exports = {
  type: EntryType,
  args: {
    _id: {
      name: '_id',
      type: new GraphQLNonNull(GraphQLID),
    },
  },
  resolve(root, params, options) {
    const projection = getProjection(options.fieldASTs[0]);

    return EntryModel
      .findById(params.id)
      .select(projection)
      .exec();
  },
};
