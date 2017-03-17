const { GraphQLNonNull, GraphQLID } = require('graphql');
const mongoose = require('mongoose');
const { inputType, outputType } = require('../../types/UserGroups');

const UserGroup = mongoose.model('UserGroup');

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
  async resolve(root, { _id, data }) {
    if (!await UserGroup.findById(_id)) throw new Error('There is no UserGroup with this ID');

    const updatedUserGroup = await UserGroup.findByIdAndUpdate(_id, data, { new: true });

    if (!updatedUserGroup) throw new Error('Error updating UserGroup');

    const socket = root.io.sockets.connected[root.req.body.socket];
    socket.broadcast.emit('update-usergroup', updatedUserGroup);

    return updatedUserGroup;
  },
};
