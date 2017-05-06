const { GraphQLNonNull, GraphQLID } = require('graphql');
const randtoken = require('rand-token');
const mongoose = require('mongoose');
const { outputType } = require('../../types/Users');
const getUserPermissions = require('../../../utils/getUserPermissions');
const sendEmail = require('../../../utils/emails/sendEmail');

const User = mongoose.model('User');

module.exports = {
  type: new GraphQLNonNull(outputType),
  args: {
    _id: {
      name: '_id',
      type: new GraphQLNonNull(GraphQLID),
    },
  },
  async resolve(root, { _id }, ctx) {
    const perms = await getUserPermissions(ctx.user._id);
    if (!perms.users.canManageUsers) throw new Error('You do not have permission to manage users.');

    const user = await User.findById(_id);
    if (!user) throw new Error('There is no user with that id.');

    const token = await randtoken.generate(16);
    const data = { token, password: undefined };

    const updatedUser = await User.findByIdAndUpdate(_id, data, { new: true });
    if (!updatedUser) throw new Error('Error updating user');

    const name = user.name.first || user.username;

    sendEmail(user.email, 'reset-password', { subject: 'Reset your password', token, name });

    return updatedUser;
  },
};
