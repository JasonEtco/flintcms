const {
  GraphQLNonNull,
  GraphQLID,
} = require('graphql');
const mongoose = require('mongoose');
const { inputType, outputType } = require('../../types/Entries');

const Entry = mongoose.model('Entry');

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
    if (!await Entry.findById(_id)) {
      throw new Error('There is no Entry with this ID');
    }

    const updatedEntry = await Entry.findByIdAndUpdate(_id, data, { new: true });

    if (!updatedEntry) throw new Error('Error updating entry');

    root.io.emit('updated-entry', updatedEntry);
    return updatedEntry;
  },
};
