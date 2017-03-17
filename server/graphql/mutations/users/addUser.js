const { GraphQLNonNull } = require('graphql');
const mongoose = require('mongoose');
const { inputType, outputType } = require('../../types/Users');
const emitSocketEvent = require('../../../utils/emitSocketEvent');

const User = mongoose.model('User');

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
    if (!username) throw new Error('You must include a username.');

    if (await User.findOne({ username })) throw new Error('There is already a user with that username.');

    const newUser = new User(args.user);
    newUser.password = await newUser.generateHash(password);

    const savedUser = await newUser.save();
    if (!savedUser) throw new Error('Could not save the User');

    emitSocketEvent(root, 'new-user', savedUser);

    return savedUser;
  },
};
