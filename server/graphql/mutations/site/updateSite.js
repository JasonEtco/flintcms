const { GraphQLNonNull } = require('graphql');
const mongoose = require('mongoose');
const { inputType, outputType } = require('../../types/Site');
const emitSocketEvent = require('../../../utils/emitSocketEvent');
const getUserPermissions = require('../../../utils/getUserPermissions');

const Site = mongoose.model('Site');

module.exports = {
  type: new GraphQLNonNull(outputType),
  args: {
    data: {
      name: 'data',
      type: new GraphQLNonNull(inputType),
    },
  },
  async resolve(root, { _id, data }, ctx) {
    const perms = await getUserPermissions(ctx.user._id);
    if (!perms.site.canManageSite) throw new Error('You do not have permission to manage site configuration.');

    const updatedSite = await Site.findOneAndUpdate({}, data, { new: true });
    if (!updatedSite) throw new Error('Error updating site configuration');

    emitSocketEvent(root, 'update-site', updatedSite);

    return updatedSite;
  },
};
