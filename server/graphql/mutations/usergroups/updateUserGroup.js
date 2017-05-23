const { GraphQLNonNull, GraphQLID } = require('graphql');
const mongoose = require('mongoose');
const { inputType, outputType } = require('../../types/UserGroups');
const emitSocketEvent = require('../../../utils/emitSocketEvent');
const events = require('../../../utils/events');
const getUserPermissions = require('../../../utils/getUserPermissions');

const UserGroup = mongoose.model('UserGroup');

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
    const perms = await getUserPermissions(ctx.user._id);
    if (!perms.users.canManageUserGroups) throw new Error('You do not have permission to manage User Groups.');

    if (!await UserGroup.findById(_id)) throw new Error('There is no UserGroup with this ID');

    events.emit('pre-update-usergroup', { _id, data });
    const updatedUserGroup = await UserGroup.findByIdAndUpdate(_id, data, { new: true });

    if (!updatedUserGroup) throw new Error('Error updating UserGroup');

    events.emit('post-update-usergroup', updatedUserGroup);
    emitSocketEvent(root, 'update-usergroup', updatedUserGroup);
    return updatedUserGroup;
  },
};
