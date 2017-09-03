const {
  GraphQLList,
} = require('graphql');

const mongoose = require('mongoose');

const Page = mongoose.model('Page');

const { outputType } = require('../../types/Pages');
const getProjection = require('../../get-projection');

module.exports = {
  type: new GraphQLList(outputType),
  args: {},
  resolve(root, args, ctx, ast) {
    const projection = getProjection(ast);

    return Page
      .find()
      .sort({ dateCreated: 1 })
      .select(projection)
      .exec();
  },
};
