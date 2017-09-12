const { GraphQLNonNull, GraphQLID } = require('graphql');
const mongoose = require('mongoose');
const { outputType } = require('../../types/UserGroups');
const getProjection = require('../../get-projection');

const UserGroup = mongoose.model('UserGroup');


module.exports = {
  type: outputType,
  args: {
    _id: {
      name: '_id',
      type: new GraphQLNonNull(GraphQLID),
    },
  },
  async resolve({ events, perms, socketEvent }, { _id }, ctx, ast) {
    if (!perms.usergroups.canDeleteUserGroups) throw new Error('You do not have permission to delete User Groups.');

    const projection = getProjection(ast);

    const foundUserGroup = await UserGroup.findById(_id);
    events.emit('pre-delete-usergroup', foundUserGroup);

    const removedUserGroup = await UserGroup
      .findByIdAndRemove(_id, { select: projection })
      .exec();

    /* istanbul ignore if */
    if (!removedUserGroup) throw new Error('Error removing user group');

    events.emit('post-delete-usergroup', removedUserGroup);
    socketEvent('delete-usergroup', removedUserGroup);
    return removedUserGroup;
  },
};
