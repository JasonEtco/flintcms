const { GraphQLNonNull, GraphQLID } = require('graphql');
const randtoken = require('rand-token');
const mongoose = require('mongoose');
const { outputType } = require('../../types/Users');
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
  async resolve({ events, perms, socketEvent }, { _id }) {
    if (!perms.users.canResetUserPasswords) throw new Error('You do not have permission to manage users.');

    const user = await User.findById(_id).exec();
    if (!user) throw new Error('There is no user with that id.');

    const token = user.token || await randtoken.generate(16);
    const data = { token, password: undefined };

    const updatedUser = await User.findByIdAndUpdate(_id, data, { new: true }).exec();

    /* istanbul ignore if */
    if (!updatedUser) throw new Error('Error updating user');

    const name = user.name.first || user.username;

    sendEmail(user.email, 'reset-password', { subject: 'Reset your password', token, name });

    return updatedUser;
  },
};
