const { GraphQLNonNull } = require('graphql');
const mongoose = require('mongoose');
const { inputType, outputType } = require('../../types/UserGroups');
const emitSocketEvent = require('../../../utils/emitSocketEvent');
const events = require('../../../utils/events');
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
    if (!perms.usergroups.canAddUserGroups) throw new Error('You do not have permission to add User Groups.');

    const newUserGroup = new UserGroup(data);

    events.emit('pre-new-usergroup', newUserGroup);

    // Emit new-usergroup event, wait for plugins to affect the new usergroup
    const savedUserGroup = await newUserGroup.save();

    if (!savedUserGroup) throw new Error('Error adding new entry');

    events.emit('post-new-usergroup', savedUserGroup);
    emitSocketEvent(root, 'new-usergroup', savedUserGroup);
    return savedUserGroup;
  },
};
