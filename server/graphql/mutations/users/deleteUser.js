const { GraphQLNonNull, GraphQLID } = require('graphql');
const mongoose = require('mongoose');
const { outputType } = require('../../types/Users');
const getProjection = require('../../get-projection');

const User = mongoose.model('User');

module.exports = {
  type: outputType,
  args: {
    _id: {
      name: '_id',
      type: new GraphQLNonNull(GraphQLID),
    },
  },
  async resolve({ events, perms, socketEvent }, { _id }, ctx, ast) {
    if (_id === ctx.user._id) throw new Error('You cannot delete your own account.');

    if (!perms.users.canDeleteUsers) {
      throw new Error('You do not have permission to delete Users.');
    }

    const foundUser = await User.findById(_id);
    if (!foundUser) throw new Error('There is no User with that id.');

    const projection = getProjection(ast);
    events.emit('pre-delete-User', _id);

    const removedUser = await User
      .findByIdAndRemove(_id, { select: projection })
      .exec();

    if (!removedUser) throw new Error('Error removing User');

    events.emit('post-delete-user', removedUser);
    socketEvent('delete-user', removedUser);
    return removedUser;
  },
};
