const {
  GraphQLList,
} = require('graphql');

const mongoose = require('mongoose');

const Section = mongoose.model('Section');

const { outputType } = require('../../types/Sections');
const getProjection = require('../../get-projection');

module.exports = {
  type: new GraphQLList(outputType),
  args: {},
  resolve(root, args, ctx, ast) {
    const projection = getProjection(ast);

    return Section
      .find()
      .select(projection)
      .exec();
  },
};
