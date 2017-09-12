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
  async resolve({ events, perms, socketEvent }, { _id, data }) {
    if (!perms.pages.canEditPages) throw new Error('You do not have permission to edit Pages.');
    const foundPage = await Page.findById(_id).exec();
    if (!foundPage) throw new Error('There is no Page with this ID');
    if (!(foundPage.homepage || data.homepage) && data.route.startsWith('/admin')) throw new Error('Routes starting with `/admin` are reserved for Flint.');

    events.emit('pre-update-page', { _id, data });

    const updatedPage = await Page.findByIdAndUpdate(_id, data, { new: true });

    /* istanbul ignore if */
    if (!updatedPage) throw new Error('Error updating Page');

    socketEvent('update-page', updatedPage);
    events.emit('post-update-page', updatedPage);
    return updatedPage;
  },
};
