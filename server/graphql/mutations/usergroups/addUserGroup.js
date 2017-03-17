const { GraphQLNonNull } = require('graphql');
const mongoose = require('mongoose');
const { inputType, outputType } = require('../../types/UserGroups');

const UserGroup = mongoose.model('UserGroup');

module.exports = {
  type: new GraphQLNonNull(outputType),
  args: {
    data: {
      name: 'data',
      type: new GraphQLNonNull(inputType),
    },
  },
  async resolve(root, { data }) {
    const newUserGroup = new UserGroup(data);
    const savedUserGroup = await newUserGroup.save();

    if (!savedUserGroup) throw new Error('Error adding new entry');

    const socket = root.io.sockets.connected[root.req.body.socket];
    socket.broadcast.emit('new-usergroup', savedUserGroup);

    return savedUserGroup;
  },
};
