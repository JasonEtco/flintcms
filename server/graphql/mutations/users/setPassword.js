const { GraphQLNonNull, GraphQLString } = require('graphql');
const mongoose = require('mongoose');
const { outputType } = require('../../types/Users');

const User = mongoose.model('User');

module.exports = {
  type: new GraphQLNonNull(outputType),
  args: {
    token: {
      name: 'token',
      type: new GraphQLNonNull(GraphQLString),
    },
    password: {
      name: 'password',
      type: new GraphQLNonNull(GraphQLString),
    },
  },
  async resolve(root, { password, token }) {
    const user = await User.findOne({ token });
    if (!user) throw new Error('Cannot find user');

    user.password = await user.generateHash(password);
    user.token = undefined;

    const savedUser = await user.save();
    if (!savedUser) throw new Error('Could not save the User');

    return savedUser;
  },
};
