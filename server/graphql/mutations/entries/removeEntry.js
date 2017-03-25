const { GraphQLNonNull, GraphQLID } = require('graphql');
const mongoose = require('mongoose');
const { outputType } = require('../../types/Entries');
const getProjection = require('../../get-projection');
const emitSocketEvent = require('../../../utils/emitSocketEvent');
const getUserPermissions = require('../../../utils/getUserPermissions');

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
    const perms = await getUserPermissions(ctx.user._id);

    if (!perms.entries.canDeleteEntries) {
      throw new Error('You do not have permission to delete Entries');
    } else if (perms.entries.canOnlyEditOwnEntries) {
      throw new Error('You may only delete Entries that you created.');
    }

    const projection = getProjection(ast);
    const removedEntry = await Entry
      .findByIdAndRemove(args._id, { select: projection })
      .exec();

    if (!removedEntry) throw new Error('Error removing entry');

    emitSocketEvent(root, 'delete-entry', removedEntry);

    return removedEntry;
  },
};
