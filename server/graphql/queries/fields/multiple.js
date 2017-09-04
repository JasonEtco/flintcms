const { GraphQLList } = require('graphql');
const mongoose = require('mongoose');
const { outputType } = require('../../types/Fields');
const getProjection = require('../../get-projection');

const Field = mongoose.model('Field');

module.exports = {
  type: new GraphQLList(outputType),
  args: {},
  resolve(root, args, ctx, ast) {
    const projection = getProjection(ast);

    return Field
      .find()
      .select(projection)
      .exec();
  },
};
