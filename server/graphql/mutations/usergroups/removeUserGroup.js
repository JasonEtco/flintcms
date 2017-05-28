const { GraphQLNonNull, GraphQLID } = require('graphql');
const mongoose = require('mongoose');
const { outputType } = require('../../types/UserGroups');
const getProjection = require('../../get-projection');
const emitSocketEvent = require('../../../utils/emitSocketEvent');
const getUserPermissions = require('../../../utils/getUserPermissions');
const events = require('../../../utils/events');

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
    const perms = await getUserPermissions(ctx.user._id);
    if (!perms.usergroups.canDeleteUserGroups) throw new Error('You do not have permission to delete User Groups.');

    const projection = getProjection(ast);

    events.emit('pre-delete-usergroup', args._id);
    const removedUserGroup = await UserGroup
      .findByIdAndRemove(args._id, { select: projection })
      .exec();

    if (!removedUserGroup) throw new Error('Error removing user group');

    events.emit('post-delete-usergroup', removedUserGroup);
    emitSocketEvent(root, 'delete-usergroup', removedUserGroup);
    return removedUserGroup;
  },
};
