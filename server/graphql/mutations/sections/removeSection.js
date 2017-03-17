const {
  GraphQLNonNull,
  GraphQLID,
} = require('graphql');
const mongoose = require('mongoose');
const { outputType } = require('../../types/Sections');
const getProjection = require('../../get-projection');
const emitSocketEvent = require('../../../utils/emitSocketEvent');

const Section = mongoose.model('Section');
const Entry = mongoose.model('Entry');

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

    Entry.remove({ section: args._id }).exec();

    if (!removedSection) throw new Error('Error removing section');

    emitSocketEvent(root, 'delete-section', removedSection);

    return removedSection;
  },
};
