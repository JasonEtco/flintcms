const { GraphQLNonNull, GraphQLID } = require('graphql');
const mongoose = require('mongoose');
const { outputType } = require('../../types/UserGroups');
const getProjection = require('../../get-projection');
const emitSocketEvent = require('../../../utils/emitSocketEvent');

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
    const projection = getProjection(ast);
    const removedUserGroup = await UserGroup
      .findByIdAndRemove(args._id, { select: projection })
      .exec();

    if (!removedUserGroup) throw new Error('Error removing user group');

    emitSocketEvent(root, 'delete-usergroup', removedUserGroup);

    return removedUserGroup;
  },
};
