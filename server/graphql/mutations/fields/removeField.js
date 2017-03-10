const {
  GraphQLNonNull,
  GraphQLID,
} = require('graphql');
const mongoose = require('mongoose');
const { outputType } = require('../../types/Fields');
const getProjection = require('../../get-projection');

const Field = mongoose.model('Field');


module.exports = {
  type: outputType,
  args: {
    _id: {
      name: '_id',
      type: new GraphQLNonNull(GraphQLID),
    },
  },
  async resolve(root, args, ctx, ast) {
    const projection = getProjection(ast);
    const removedField = await Field
      .findByIdAndRemove(args._id, { select: projection })
      .exec();

    if (!removedField) {
      throw new Error('Error removing field');
    }

    root.io.emit('delete-field', removedField);
    return removedField;
  },
};
