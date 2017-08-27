const { GraphQLID, GraphQLNonNull } = require('graphql');
const mongoose = require('mongoose');

const { outputType } = require('../../types/Fields');
const getProjection = require('../../get-projection');

const Field = mongoose.model('Field');

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

    return Field
      .findById(args._id)
      .select(projection)
      .exec();
  },
};
