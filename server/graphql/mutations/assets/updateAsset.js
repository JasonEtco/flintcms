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
  async resolve({ events, perms, socketEvent }, { data, _id }) {
    if (perms && !perms.assets.canEditAssets) throw new Error('You do not have permission to edit assets.');

    const foundAsset = await Asset.findById(_id).lean().exec();
    if (!foundAsset) throw new Error('There is no Asset with that id');
    if (events) events.emit('pre-update-asset', { _id, data });

    const updatedAsset = await Asset.findByIdAndUpdate(_id, data, { new: true });

    /* istanbul ignore if */
    if (!updatedAsset) throw new Error('Error updating Asset');

    if (socketEvent) socketEvent('update-asset', updatedAsset);
    if (events) events.emit('post-update-asset', updatedAsset);
    return updatedAsset;
  },
};
