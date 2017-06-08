const { GraphQLNonNull } = require('graphql');
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
  },
  async resolve({ io, perms }, args) {
    if (!perms.assets.canAddAssets) throw new Error('You do not have permission to add new assets.');

    const newAsset = new Asset(args.data);
    root.events.emit('pre-new-asset', newAsset);

    const savedAsset = await newAsset.save();

    if (!savedAsset) throw new Error('There was a problem saving the asset.');

    root.events.emit('post-new-asset', savedAsset);
    root.socketEvent('new-asset', savedAsset);
    return savedAsset;
  },
};
