const { GraphQLNonNull, GraphQLID } = require('graphql');
const mongoose = require('mongoose');
const { inputType, outputType } = require('../../types/Pages');

const Page = mongoose.model('Page');

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
  async resolve(root, { _id, data }) {
    const { perms } = root;
    if (!perms.pages.canEditPages) throw new Error('You do not have permission to edit Pages.');
    if (!await Page.findById(_id)) throw new Error('There is no Page with this ID');
    if (data.route.startsWith('/admin')) throw new Error('Routes starting with `/admin` are reserved for Flint.');

    root.events.emit('pre-update-page', { _id, data });

    const updatedPage = await Page.findByIdAndUpdate(_id, data, { new: true });
    if (!updatedPage) throw new Error('Error updating Page');

    root.socketEvent('update-page', updatedPage);
    root.events.emit('post-update-page', updatedPage);
    return updatedPage;
  },
};
