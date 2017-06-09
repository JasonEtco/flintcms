const {
  GraphQLNonNull,
} = require('graphql');
const mongoose = require('mongoose');
const { inputType, outputType } = require('../../types/Pages');
const h = require('../../../utils/helpers');

const Page = mongoose.model('Page');

module.exports = {
  type: new GraphQLNonNull(outputType),
  args: {
    data: {
      name: 'data',
      type: new GraphQLNonNull(inputType),
    },
  },
  async resolve(root, args) {
    const { perms } = root;
    if (!perms.pages.canAddPages) throw new Error('You do not have permission to create a new Page.');

    const { fieldLayout, title } = args.data;
    if (fieldLayout === undefined || fieldLayout.length === 0) throw new Error('You must include at least one field.');
    if (!title) throw new Error('You must include a title.');

    const slug = h.slugify(title);
    if (await Page.findOne({ slug })) throw new Error('There is already a page with that slug.');

    const newPage = new Page(args.data);

    if (args.data.homepage) {
      newPage.route = '/';

      const HomePage = await Page.findOne({ homepage: true });
      if (HomePage) {
        await Page.findByIdAndUpdate(HomePage._id, { homepage: false });
      }
    }

    root.events.emit('pre-new-page', newPage);

    const savedPage = await newPage.save();
    if (!savedPage) throw new Error('Could not save the page.');

    root.socketEvent('new-page', savedPage);
    root.events.emit('post-new-page', savedPage);
    return savedPage;
  },
};

