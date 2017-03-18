const { GraphQLNonNull, GraphQLID } = require('graphql');
const mongoose = require('mongoose');
const { inputType, outputType } = require('../../types/Entries');
const emitSocketEvent = require('../../../utils/emitSocketEvent');
const getUserPermissions = require('../../../utils/getUserPermissions');

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
    const foundEntry = await Entry.findById(_id).lean().exec();
    if (!foundEntry) throw new Error('There is no Entry with this ID');

    const perms = await getUserPermissions(ctx.user._id);

    // If user can edit entries that aren't their own
    const authorId = foundEntry.author.toString();
    const userId = ctx.user._id.toString();
    if (authorId !== userId && perms.canOnlyEditOwnEntries) {
      throw new Error('You are not allowed to edit this entry. Sorry!');
    }

    // If user can edit the status of entries
    if (data.status !== foundEntry.status.toString() && !perms.canChangeEntryStatus) {
      throw new Error('You are not allowed to change the status of entries. Sorry!');
    }

    // If user can edit live entries
    if (foundEntry.status.toString() === 'live' && !perms.canEditLive) {
      throw new Error('You are not allowed to edit a live entry. Sorry!');
    }

    const updatedEntry = await Entry.findByIdAndUpdate(_id, data, { new: true });

    if (!updatedEntry) throw new Error('Error updating entry');

    emitSocketEvent(root, 'update-entry', updatedEntry);

    return updatedEntry;
  },
};
