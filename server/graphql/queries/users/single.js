const { GraphQLID } = require('graphql');
const mongoose = require('mongoose');

const { outputType } = require('../../types/Users');
const getProjection = require('../../get-projection');

const User = mongoose.model('User');

module.exports = {
  type: outputType,
  args: {
    _id: {
      name: '_id',
      type: GraphQLID,
    },
  },
  resolve(root, args, ctx, ast) {
    const _id = args._id || ctx.user._id;
    const projection = getProjection(ast);

    return User
      .findById(_id)
      .select(projection)
      .lean()
      .exec();
  },
};
