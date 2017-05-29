const { GraphQLList } = require('graphql');

const mongoose = require('mongoose');

const Plugin = mongoose.model('Plugin');

const { outputType } = require('../../types/Plugins');
const getProjection = require('../../get-projection');

module.exports = {
  type: new GraphQLList(outputType),
  args: {},
  resolve(root, args, ctx, ast) {
    const projection = getProjection(ast);

    return Plugin
      .find()
      .select(projection)
      .exec();
  },
};
