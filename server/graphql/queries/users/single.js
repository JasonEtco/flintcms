const {
  GraphQLID,
  GraphQLNonNull,
} = require('graphql');
const mongoose = require('mongoose');

const UserType = require('../../types/User');
const getProjection = require('../../get-projection');

const User = mongoose.model('User');

module.exports = {
  type: UserType,
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
