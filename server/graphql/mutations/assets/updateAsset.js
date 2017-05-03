const { GraphQLNonNull } = require('graphql');
const mongoose = require('mongoose');
const emitSocketEvent = require('../../../utils/emitSocketEvent');
const { inputType, outputType } = require('../../types/Assets');

const Asset = mongoose.model('Asset');

module.exports = {
  type: new GraphQLNonNull(outputType),
  args: {
    data: {
      name: 'data',
      type: new GraphQLNonNull(inputType),
    },
  },
  async resolve(root, { data, _id }) {
    const foundAsset = await Asset.findById(_id).lean().exec();
    if (!foundAsset) throw new Error('There is no Asset with this ID');

    const updatedAsset = await Asset.findByIdAndUpdate(_id, data, { new: true });

    if (!updatedAsset) throw new Error('Error updating Asset');

    emitSocketEvent(root, 'update-asset', updatedAsset);

    return updatedAsset;
  },
};
