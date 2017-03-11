const {
  GraphQLNonNull,
  GraphQLID,
} = require('graphql');
const mongoose = require('mongoose');
const { inputType, outputType } = require('../../types/Sections');

const Section = mongoose.model('Section');

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
    if (!await Section.findById(_id)) {
      throw new Error('There is no Section with this ID');
    }

    const updatedSection = await Section.findByIdAndUpdate(_id, data, { new: true });
    if (!updatedSection) throw new Error('Error updating Section');

    const socket = root.io.sockets.connected[root.req.body.socket];
    socket.broadcast.emit('update-section', updatedSection);

    return updatedSection;
  },
};
