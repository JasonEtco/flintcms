const {
  GraphQLList,
} = require('graphql');

const mongoose = require('mongoose');

const Asset = mongoose.model('Asset');

const { outputType } = require('../../types/Assets');
const getProjection = require('../../get-projection');

module.exports = {
  type: new GraphQLList(outputType),
  args: {},
  resolve(root, args, ctx, ast) {
    const projection = getProjection(ast);

    return Asset
      .find()
      .select(projection)
      .exec();
  },
};
