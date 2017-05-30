const { GraphQLNonNull, GraphQLID } = require('graphql');
const mongoose = require('mongoose');
const { inputType, outputType } = require('../../types/Entries');

const Entry = mongoose.model('Entry');

module.exports = {
  type: new GraphQLNonNull(outputType),
  args: {
    _id: {
      name: '_id',
      type: new GraphQLNonNull(GraphQLID),
    },
    data: {
      name: 'data',
      type: new GraphQLNonNull(inputType),
    },
  },
  async resolve(root, { _id, data }, ctx) {
    const { perms } = root;
    const foundEntry = await Entry.findById(_id).lean().exec();
    if (!foundEntry) throw new Error('There is no Entry with this ID');

    const isOwnEntry = foundEntry.author.toString() === ctx.user._id.toString();

    // If user can edit entries that aren't their own
    if (!isOwnEntry && perms.entries.canOnlyEditOwnEntries) {
      throw new Error('You are not allowed to edit this entry. Sorry!');
    }

    // If user can edit the status of entries
    if (data.status !== foundEntry.status.toString() && !perms.entries.canChangeEntryStatus) {
      throw new Error('You are not allowed to change the status of entries. Sorry!');
    }

    // If user can edit live entries
    if (foundEntry.status.toString() === 'live' && !perms.entries.canEditLive && !isOwnEntry) {
      throw new Error('You are not allowed to edit a live entry. Sorry!');
    }

    root.events.emit('pre-update-entry', { _id, data });

    const updatedEntry = await Entry.findByIdAndUpdate(_id, data, { new: true });
    if (!updatedEntry) throw new Error('Error updating entry');

    root.events.emit('post-update-entry', updatedEntry);
    root.socketEvent('update-entry', updatedEntry);
    return updatedEntry;
  },
};
