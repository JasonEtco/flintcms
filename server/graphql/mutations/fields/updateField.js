const { GraphQLNonNull, GraphQLID } = require('graphql');
const mongoose = require('mongoose');
const { inputType, outputType } = require('../../types/Fields');
const emitSocketEvent = require('../../../utils/emitSocketEvent');
const getUserPermissions = require('../../../utils/getUserPermissions');

const Field = mongoose.model('Field');

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
  async resolve(root, { _id, data }, ctx) {
    const foundField = await Field.findById(_id).lean().exec();
    if (!foundField) throw new Error('There is no Field with this ID');

    const perms = await getUserPermissions(ctx.user._id);

    const updatedField = await Field.findByIdAndUpdate(_id, data, { new: true });

    if (!updatedField) throw new Error('Error updating Field');

    emitSocketEvent(root, 'update-field', updatedField);

    return updatedField;
  },
};
