const { GraphQLNonNull, GraphQLID } = require('graphql');
const mongoose = require('mongoose');
const { inputType, outputType } = require('../../types/Assets');

const Asset = mongoose.model('Asset');

module.exports = {
  type: new GraphQLNonNull(outputType),
  args: {
    data: {
      name: 'data',
      type: new GraphQLNonNull(inputType),
    },
    _id: {
      name: '_id',
      type: new GraphQLNonNull(GraphQLID),
    },
  },
  async resolve(root, { data, _id }) {
    if (!root.perms.canEditAssets) throw new Error('You do not have permission to edit assets.');

    const foundAsset = await Asset.findById(_id).lean().exec();
    if (!foundAsset) throw new Error('There is no Asset with this ID');

    const updatedAsset = await Asset.findByIdAndUpdate(_id, data, { new: true });

    if (!updatedAsset) throw new Error('Error updating Asset');

    root.socketEvent('update-asset', updatedAsset);

    return updatedAsset;
  },
};
