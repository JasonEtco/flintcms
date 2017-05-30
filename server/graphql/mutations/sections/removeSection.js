const { GraphQLNonNull, GraphQLID } = require('graphql');
const mongoose = require('mongoose');
const { outputType } = require('../../types/Sections');
const getProjection = require('../../get-projection');

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
    const { perms } = root;
    if (!perms.sections.canDeleteSections) throw new Error('You do not have permission to delete Sections.');

    const projection = getProjection(ast);
    root.events.emit('pre-delete-section', args._id);

    const removedSection = await Section
      .findByIdAndRemove(args._id, { select: projection })
      .exec();

    Entry.remove({ section: args._id }).exec();

    if (!removedSection) throw new Error('Error removing section');

    root.socketEvent('delete-section', removedSection);
    root.events.emit('post-delete-section', removedSection);
    return removedSection;
  },
};
