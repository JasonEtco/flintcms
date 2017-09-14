const { GraphQLList } = require('graphql');
const mongoose = require('mongoose');
const { outputType } = require('../../types/Sections');
const getProjection = require('../../get-projection');

const Section = mongoose.model('Section');

module.exports = {
  type: new GraphQLList(outputType),
  args: {},
  resolve(root, args, ctx, ast) {
    const projection = getProjection(ast);

    return Section
      .find()
      .sort({ dateCreated: 1 })
      .select(projection)
      .exec();
  },
};
