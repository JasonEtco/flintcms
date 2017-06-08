const { GraphQLNonNull } = require('graphql');
const mongoose = require('mongoose');
const { inputType, outputType } = require('../../types/Site');

const Site = mongoose.model('Site');

module.exports = {
  type: new GraphQLNonNull(outputType),
  args: {
    data: {
      name: 'data',
      type: new GraphQLNonNull(inputType),
    },
  },
  async resolve(root, { data }) {
    const { perms } = root;
    if (!perms.site.canManageSite) throw new Error('You do not have permission to manage site configuration.');

    root.events.emit('pre-update-site', data);

    const updatedSite = await Site.findOneAndUpdate({}, data, { new: true });
    if (!updatedSite) throw new Error('Error updating site configuration');

    root.socketEvent('update-site', updatedSite);

    root.events.emit('post-update-site', updatedSite);
    return updatedSite;
  },
};
