const { GraphQLNonNull } = require('graphql');
const randtoken = require('rand-token');
const mongoose = require('mongoose');
const { inputType, outputType } = require('../../types/Users');

const sendEmail = require('../../../utils/emails/sendEmail');

const User = mongoose.model('User');
const Site = mongoose.model('Site');

module.exports = {
  type: new GraphQLNonNull(outputType),
  args: {
    user: {
      name: 'user',
      type: new GraphQLNonNull(inputType),
    },
  },
  async resolve(root, args) {
    const { username, password } = args.user;

    const { perms } = root;
    if (!perms.users.canAddUsers) throw new Error('You do not have permission to manage users.');

    if (!username) throw new Error('You must include a username.');

    if (await User.findOne({ username })) throw new Error('There is already a user with that username.');

    const newUser = new User(args.user);

    const { defaultUserGroup } = await Site.findOne();
    newUser.usergroup = defaultUserGroup;

    newUser.password = await newUser.generateHash(password);
    const token = await randtoken.generate(16);
    newUser.token = token;

    await User.populate(newUser, { path: 'usergroup' });

    root.events.emit('pre-new-user', newUser);

    const savedUser = await newUser.save();
    if (!savedUser) throw new Error('Could not save the User');

    sendEmail(args.user.email, 'new-account', { subject: 'Confirm your account', token });
    root.events.emit('post-new-user', savedUser);
    root.socketEvent('new-user', savedUser);
    return savedUser;
  },
};
