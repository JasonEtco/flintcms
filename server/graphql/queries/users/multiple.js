const {
  GraphQLList,
} = require('graphql');

const mongoose = require('mongoose');

const User = mongoose.model('User');

const userType = require('../../types/User');
const getProjection = require('../../get-projection');

module.exports = {
  type: new GraphQLList(userType),
  args: {},
  resolve(root, args, ctx, ast) {
    const projection = getProjection(ast);

    return User
      .find()
      .select(projection)
      .exec();
  },
};
