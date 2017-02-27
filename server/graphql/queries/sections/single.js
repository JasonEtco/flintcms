const {
  GraphQLID,
  GraphQLNonNull,
} = require('graphql');
const mongoose = require('mongoose');
const { outputType } = require('../../types/Entries');
const getProjection = require('../../get-projection');

const Section = mongoose.model('Section');

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

    return Section
      .findById(args.id)
      .select(projection)
      .exec();
  },
};
