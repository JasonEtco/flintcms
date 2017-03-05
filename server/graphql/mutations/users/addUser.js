const {
  GraphQLNonNull,
} = require('graphql');
const mongoose = require('mongoose');
const { inputType, outputType } = require('../../types/Users');

const User = mongoose.model('User');

module.exports = {
  type: new GraphQLNonNull(outputType),
  args: {
    data: {
      name: 'data',
      type: new GraphQLNonNull(inputType),
    },
  },
  async resolve(root, params) {
    const { username, password } = params.data;
    if (!username) throw new Error('You must include a username.');

    if (await User.findOne({ username })) throw new Error('There is already a user with that username.');

    const newUser = new User({
      username,
      password: User.generateHash(password),
    });
    const savedUser = await newUser.save();

    root.io.emit('new-user', savedUser);
    return savedUser;
  },
};
