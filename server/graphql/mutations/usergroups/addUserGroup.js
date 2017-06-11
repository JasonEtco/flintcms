const { GraphQLNonNull } = require('graphql');
const mongoose = require('mongoose');
const { inputType, outputType } = require('../../types/UserGroups');

const UserGroup = mongoose.model('UserGroup');

module.exports = {
  type: new GraphQLNonNull(outputType),
  args: {
    data: {
      name: 'data',
      type: new GraphQLNonNull(inputType),
    },
  },
  async resolve({ events, perms, socketEvent }, { data }) {
    if (!perms.usergroups.canAddUserGroups) throw new Error('You do not have permission to add User Groups.');

    const newUserGroup = new UserGroup(data);

    events.emit('pre-new-usergroup', newUserGroup);

    const savedUserGroup = await newUserGroup.save();

    if (!savedUserGroup) throw new Error('Error adding new entry');

    events.emit('post-new-usergroup', savedUserGroup);
    socketEvent('new-usergroup', savedUserGroup);
    return savedUserGroup;
  },
};
