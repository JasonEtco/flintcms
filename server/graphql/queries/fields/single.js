const {
  GraphQLID,
  GraphQLNonNull,
} = require('graphql');
const mongoose = require('mongoose');

const FieldType = require('../../types/Field');
const getProjection = require('../../get-projection');

const Field = mongoose.model('Field');

module.exports = {
  type: FieldType,
  args: {
    _id: {
      name: '_id',
      type: new GraphQLNonNull(GraphQLID),
    },
  },
  resolve(root, args, ctx, ast) {
    const projection = getProjection(ast);

    return Field
      .findById(args.id)
      .select(projection)
      .exec();
  },
};
