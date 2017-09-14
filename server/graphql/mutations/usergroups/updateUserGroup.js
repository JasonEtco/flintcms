const { GraphQLNonNull, GraphQLID } = require('graphql');
const mongoose = require('mongoose');
const { inputType, outputType } = require('../../types/UserGroups');

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
  async resolve({ events, perms, socketEvent }, { _id, data }) {
    if (!perms.usergroups.canEditUserGroups) throw new Error('You do not have permission to edit User Groups.');

    const foundUserGroup = await UserGroup.findById(_id);
    if (!foundUserGroup) throw new Error('There is no UserGroup with this ID');
    if (foundUserGroup.slug === 'admin') throw new Error('You cannot edit the Admin usergroup.');

    events.emit('pre-update-usergroup', { _id, data });
    const updatedUserGroup = await UserGroup.findByIdAndUpdate(_id, data, { new: true });

    /* istanbul ignore if */
    if (!updatedUserGroup) throw new Error('Error updating UserGroup');

    events.emit('post-update-usergroup', updatedUserGroup);
    socketEvent('update-usergroup', updatedUserGroup);
    return updatedUserGroup;
  },
};
