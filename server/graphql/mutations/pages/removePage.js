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
  async resolve(root, args, ctx, ast) {
    const { perms } = root;
    if (!perms.pages.canDeletePages) throw new Error('You do not have permission to delete Pages.');

    const projection = getProjection(ast);
    root.events.emit('pre-delete-page', args._id);

    const removedPage = await Page
      .findByIdAndRemove(args._id, { select: projection })
      .exec();

    if (!removedPage) throw new Error('Error removing page');

    root.socketEvent('delete-page', removedPage);
    root.events.emit('post-delete-page', removedPage);
    return removedPage;
  },
};
