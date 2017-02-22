// graphql/mutations/blog-post/add.js
const {
  GraphQLNonNull,
  GraphQLBoolean,
} = require('graphql');

const blogPostInputType = require('../types/Entries');
const EntryModel = require('../../models/EntryModel');

module.exports = {
  type: GraphQLBoolean,
  args: {
    data: {
      name: 'data',
      type: new GraphQLNonNull(blogPostInputType),
    },
  },
  async resolve(root, params, options) {
    const entryModel = new EntryModel(params.data);
    const newEntry = await entryModel.save();

    if (!newEntry) {
      throw new Error('Error adding new blog post');
    }
    return true;
  },
};
