const {
  GraphQLID,
  GraphQLNonNull,
} = require('graphql');
const mongoose = require('mongoose');

const { outputType } = require('../../types/Users');
const getProjection = require('../../get-projection');

const User = mongoose.model('User');

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

    return User
      .findById(args.id)
      .select(projection)
      .exec();
  },
};
