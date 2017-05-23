const { GraphQLNonNull, GraphQLID } = require('graphql');
const mongoose = require('mongoose');
const { inputType, outputType } = require('../../types/Users');
const emitSocketEvent = require('../../../utils/emitSocketEvent');
const getUserPermissions = require('../../../utils/getUserPermissions');
const events = require('../../../utils/events');

const User = mongoose.model('User');

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
    if (!perms.users.canManageUsers && _id !== ctx.user._id) throw new Error('You do not have permission to manage users.');

    const foundUser = await User.findById(_id).lean().exec();
    if (!foundUser) throw new Error('There is no User with this ID');

    events.emit('pre-update-user', { _id, data });

    const updatedUser = await User.findByIdAndUpdate(_id, data, { new: true });
    if (!updatedUser) throw new Error('Error updating user');

    emitSocketEvent(root, 'update-user', updatedUser);
    events.emit('post-update-user', updatedUser);
    return updatedUser;
  },
};
