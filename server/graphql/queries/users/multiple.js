const {
  GraphQLList,
} = require('graphql');

const mongoose = require('mongoose');

const User = mongoose.model('User');

const { outputType } = require('../../types/Users');
const getProjection = require('../../get-projection');

module.exports = {
  type: new GraphQLList(outputType),
  args: {},
  resolve(root, args, ctx, ast) {
    const projection = getProjection(ast);

    return User
      .find()
      .select(projection)
      .exec();
  },
};
