const {
  GraphQLNonNull,
} = require('graphql');
const mongoose = require('mongoose');
const { inputType, outputType } = require('../../types/Assets');
const h = require('../../../utils/helpers');

const Asset = mongoose.model('Asset');

module.exports = {
  type: new GraphQLNonNull(outputType),
  args: {
    data: {
      name: 'data',
      type: new GraphQLNonNull(inputType),
    },
  },
  async resolve(root, params) {
    const newAsset = new Asset();
    const savedAsset = await newAsset.save();

    if (!savedAsset) throw new Error('Error adding new asset');

    root.io.emit('new-asset', savedAsset);
    return savedAsset;
  },
};
