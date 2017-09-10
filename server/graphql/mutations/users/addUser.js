const { GraphQLNonNull } = require('graphql');
const randtoken = require('rand-token');
const mongoose = require('mongoose');
const { inputType, outputType } = require('../../types/Users');

const sendEmail = require('../../../utils/emails/sendEmail');

const User = mongoose.model('User');
const UserGroup = mongoose.model('UserGroup');
const Site = mongoose.model('Site');

module.exports = {
  type: new GraphQLNonNull(outputType),
  args: {
    user: {
      name: 'user',
      type: new GraphQLNonNull(inputType),
    },
  },
  async resolve({ events, perms, socketEvent }, args) {
    const { username, email } = args.user;

    if (perms && !perms.users.canAddUsers) throw new Error('You do not have permission to manage users.');
    if (!username) throw new Error('You must include a username.');
    if (await User.findOne({ username })) throw new Error('There is already a user with that username.');
    if (await User.findOne({ email })) throw new Error('There is already a user with that email.');
    if (!await UserGroup.findById(args.user.usergroup)) throw new Error('That UserGroup does not exist.');

    const newUser = new User(args.user);

    // Set usergroup if there isn't already one
    if (!args.user.usergroup) {
      const { defaultUserGroup } = await Site.findOne();
      if (!defaultUserGroup) throw new Error('There is no default user group.');
      newUser.usergroup = defaultUserGroup;
    }

    // Create temporary token to send confirmation email
    const token = await randtoken.generate(16);
    newUser.token = token;


    events.emit('pre-new-user', newUser);

    const savedUser = await newUser.save();

    /* istanbul ignore if */
    if (!savedUser) throw new Error('Could not save the User');
    await User.populate(savedUser, { path: 'usergroup' });

    sendEmail(args.user.email, 'new-account', { subject: 'Confirm your account', token });
    events.emit('post-new-user', savedUser);
    socketEvent('new-user', savedUser);
    return savedUser;
  },
};
