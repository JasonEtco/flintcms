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
  async resolve(root, { _id }, ctx, ast) {
    const { perms } = root;
    if (!perms.entries.canDeleteEntries) {
      throw new Error('You do not have permission to delete Entries');
    }

    const foundEntry = await Entry.findById(_id);
    if (!foundEntry) throw new Error('There is no entry with that id');

    if (!perms.entries.canEditOthersEntries && foundEntry.author !== ctx.user._id) {
      throw new Error('You may only delete Entries that you created.');
    }

    const projection = getProjection(ast);
    root.events.emit('pre-delete-entry', foundEntry);

    const removedEntry = await Entry
      .findByIdAndRemove(_id, { select: projection })
      .exec();

    if (!removedEntry) throw new Error('Error removing entry');

    root.events.emit('post-delete-entry', removedEntry);
    root.socketEvent('delete-entry', removedEntry);
    return removedEntry;
  },
};
