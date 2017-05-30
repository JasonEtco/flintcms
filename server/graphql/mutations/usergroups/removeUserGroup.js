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
  async resolve(root, args, ctx, ast) {
    const { perms } = root;
    if (!perms.usergroups.canDeleteUserGroups) throw new Error('You do not have permission to delete User Groups.');

    const projection = getProjection(ast);

    root.events.emit('pre-delete-usergroup', args._id);
    const removedUserGroup = await UserGroup
      .findByIdAndRemove(args._id, { select: projection })
      .exec();

    if (!removedUserGroup) throw new Error('Error removing user group');

    root.events.emit('post-delete-usergroup', removedUserGroup);
    root.socketEvent('delete-usergroup', removedUserGroup);
    return removedUserGroup;
  },
};
