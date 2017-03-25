const { GraphQLNonNull } = require('graphql');
const mongoose = require('mongoose');
const { inputType, outputType } = require('../../types/UserGroups');
const emitSocketEvent = require('../../../utils/emitSocketEvent');
const getUserPermissions = require('../../../utils/getUserPermissions');

const UserGroup = mongoose.model('UserGroup');

module.exports = {
  type: new GraphQLNonNull(outputType),
  args: {
    data: {
      name: 'data',
      type: new GraphQLNonNull(inputType),
    },
  },
  async resolve(root, { data }, ctx) {
    const perms = await getUserPermissions(ctx.user._id);
    if (!perms.users.canManageUserGroups) throw new Error('You do not have permission to manage User Groups.');

    const newUserGroup = new UserGroup(data);
    const savedUserGroup = await newUserGroup.save();

    if (!savedUserGroup) throw new Error('Error adding new entry');

    emitSocketEvent(root, 'new-usergroup', savedUserGroup);

    return savedUserGroup;
  },
};
