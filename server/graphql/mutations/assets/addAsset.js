const {
  GraphQLNonNull,
} = require('graphql');
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
  async resolve(root, args) {
    const newAsset = new Asset(args.data);

    const savedAsset = await newAsset.save();

    if (!savedAsset) throw new Error('There was a problem saving the asset.');

    root.io.emit('new-asset', savedAsset);
    return savedAsset;
  },
};
