const { GraphQLNonNull, GraphQLID } = require('graphql');
const mongoose = require('mongoose');
const { inputType, outputType } = require('../../types/Users');

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
    const { perms } = root;
    if (!perms.users.canManageUsers && _id !== ctx.user._id) throw new Error('You do not have permission to manage users.');

    const foundUser = await User.findById(_id).lean().exec();
    if (!foundUser) throw new Error('There is no User with this ID');

    root.events.emit('pre-update-user', { _id, data });

    const updatedUser = await User.findByIdAndUpdate(_id, data, { new: true });
    if (!updatedUser) throw new Error('Error updating user');

    await User.populate(updatedUser, { path: 'usergroup' });

    root.socketEvent('update-user', updatedUser);
    root.events.emit('post-update-user', updatedUser);
    return updatedUser;
  },
};
