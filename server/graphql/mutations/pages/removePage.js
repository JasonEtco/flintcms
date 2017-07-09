const { GraphQLNonNull, GraphQLID } = require('graphql');
const mongoose = require('mongoose');
const { outputType } = require('../../types/Pages');
const getProjection = require('../../get-projection');

const Page = mongoose.model('Page');

module.exports = {
  type: outputType,
  args: {
    _id: {
      name: '_id',
      type: new GraphQLNonNull(GraphQLID),
    },
  },
  async resolve({ events, perms, socketEvent }, args, ctx, ast) {
    if (!perms.pages.canDeletePages) throw new Error('You do not have permission to delete Pages.');

    const projection = getProjection(ast);
    events.emit('pre-delete-page', args._id);

    const removedPage = await Page
      .findByIdAndRemove(args._id, { select: projection })
      .exec();

    if (!removedPage) throw new Error('Error removing page');

    socketEvent('delete-page', removedPage);
    events.emit('post-delete-page', removedPage);
    return removedPage;
  },
};
