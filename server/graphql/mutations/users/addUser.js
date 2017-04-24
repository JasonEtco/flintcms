const { GraphQLNonNull } = require('graphql');
const randtoken = require('rand-token');
const mongoose = require('mongoose');
const { inputType, outputType } = require('../../types/Users');
const emitSocketEvent = require('../../../utils/emitSocketEvent');
const getUserPermissions = require('../../../utils/getUserPermissions');
const sendEmail = require('../../../utils/emails/sendEmail');

const User = mongoose.model('User');

module.exports = {
  type: new GraphQLNonNull(outputType),
  args: {
    user: {
      name: 'user',
      type: new GraphQLNonNull(inputType),
    },
  },
  async resolve(root, args, ctx) {
    const { username, password } = args.user;

    const perms = await getUserPermissions(ctx.user._id);
    if (!perms.users.canManageUsers) throw new Error('You do not have permission to manage users.');

    if (!username) throw new Error('You must include a username.');

    if (await User.findOne({ username })) throw new Error('There is already a user with that username.');

    const newUser = new User(args.user);

    newUser.password = await newUser.generateHash(password);
    const token = await randtoken.generate(16);
    newUser.token = token;

    const savedUser = await newUser.save();
    if (!savedUser) throw new Error('Could not save the User');

    sendEmail(args.user.email, 'new-account', { subject: 'Confirm your account', token });
    emitSocketEvent(root, 'new-user', savedUser);

    return savedUser;
  },
};
