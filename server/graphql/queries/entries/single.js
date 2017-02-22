const {
  GraphQLID,
  GraphQLNonNull,
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
  resolve(root, args, ctx, ast) {
    const projection = getProjection(ast);

    return Entry
      .findById(args.id)
      .select(projection)
      .exec();
  },
};
