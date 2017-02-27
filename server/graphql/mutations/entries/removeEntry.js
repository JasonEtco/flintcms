const {
  GraphQLNonNull,
  GraphQLID,
} = require('graphql');
const mongoose = require('mongoose');
const { outputType } = require('../../types/Entries');
const getProjection = require('../../get-projection');

const Entry = mongoose.model('Entry');


module.exports = {
  type: outputType,
  args: {
    _id: {
      name: '_id',
      type: new GraphQLNonNull(GraphQLID),
    },
  },
  async resolve(root, args, ctx, ast) {
    const projection = getProjection(ast);
    const removedEntry = await Entry
      .findByIdAndRemove(args._id, { select: projection })
      .exec();

    if (!removedEntry) {
      throw new Error('Error removing blog post');
    }

    return removedEntry;
  },
};
