const {
  GraphQLID,
  GraphQLNonNull,
} = require('graphql');
const mongoose = require('mongoose');

const { outputType } = require('../../types/Assets');
const getProjection = require('../../get-projection');

const Asset = mongoose.model('Asset');

module.exports = {
  type: outputType,
  args: {
    _id: {
      name: '_id',
      type: new GraphQLNonNull(GraphQLID),
    },
  },
  resolve(root, args, ctx, ast) {
    const projection = getProjection(ast);

    return Asset
      .findById(args.id)
      .select(projection)
      .exec();
  },
};
