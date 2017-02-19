const {
  GraphQLList,
} = require('graphql');

const mongoose = require('mongoose');

const Field = mongoose.model('Field');

const fieldType = require('../../types/Field');
const getProjection = require('../../get-projection');

module.exports = {
  type: new GraphQLList(fieldType),
  args: {},
  resolve(root, args, ctx, ast) {
    const projection = getProjection(ast);

    return Field
      .find()
      .select(projection)
      .exec();
  },
};
