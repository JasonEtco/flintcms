const {
  GraphQLNonNull,
  GraphQLID,
} = require('graphql');
const mongoose = require('mongoose');
const { outputType } = require('../../types/Sections');
const getProjection = require('../../get-projection');

const Section = mongoose.model('Section');

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
    const removedSection = await Section
      .findByIdAndRemove(args._id, { select: projection })
      .exec();

    if (!removedSection) {
      throw new Error('Error removing blog post');
    }

    root.io.emit('delete-section', removedSection);
    return removedSection;
  },
};
