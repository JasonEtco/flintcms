const { GraphQLNonNull, GraphQLID } = require('graphql');
const mongoose = require('mongoose');
const { outputType } = require('../../types/Entries');
const getProjection = require('../../get-projection');

const Entry = mongoose.model('Entry');


module.exports = {
  type: outputType,
  args: {
    _id: {
      name: '_id',
      type: new GraphQLNonNull(GraphQLID),
    },
  },
  async resolve({ events, perms, socketEvent }, { _id }, ctx, ast) {
    if (!perms.entries.canDeleteEntries) {
      throw new Error('You do not have permission to delete Entries');
    }

    const foundEntry = await Entry.findById(_id);
    if (!foundEntry) throw new Error('There is no entry with that id');

    if (!perms.entries.canEditOthersEntries && foundEntry.author !== ctx.user._id) {
      throw new Error('You may only delete Entries that you created.');
    }

    const projection = getProjection(ast);
    events.emit('pre-delete-entry', foundEntry);

    const removedEntry = await Entry
      .findByIdAndRemove(_id, { select: projection })
      .exec();

    /* istanbul ignore if */
    if (!removedEntry) throw new Error('Error removing entry');

    events.emit('post-delete-entry', removedEntry);
    socketEvent('delete-entry', removedEntry);
    return removedEntry;
  },
};
