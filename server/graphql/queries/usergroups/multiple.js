const {
  GraphQLList,
  GraphQLString,
} = require('graphql');

const mongoose = require('mongoose');

const UserGroup = mongoose.model('UserGroup');

const { outputType } = require('../../types/UserGroups');
const getProjection = require('../../get-projection');

module.exports = {
  type: new GraphQLList(outputType),
  args: {
    status: {
      name: 'status',
      type: GraphQLString,
    },
  },
  resolve(root, args, ctx, ast) {
    const projection = getProjection(ast);

    return UserGroup
      .find(args)
      .sort({ dateCreated: 1 })
      .select(projection)
      .exec();
  },
};
