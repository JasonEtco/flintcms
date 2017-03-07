const {
  GraphQLNonNull,
  GraphQLID,
} = require('graphql');
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const { outputType } = require('../../types/Assets');

const Asset = mongoose.model('Asset');

module.exports = {
  type: outputType,
  args: {
    _id: {
      name: '_id',
      type: new GraphQLNonNull(GraphQLID),
    },
  },
  async resolve(root, { _id }) {
    const foundAsset = await Asset.findById(_id).exec();
    if (!foundAsset) throw new Error('This asset doesn\'t exist.');

    const removedAsset = await Asset.findByIdAndRemove(_id).exec();
    if (!removedAsset) throw new Error('Error removing asset');

    const pathToFile = path.join(__dirname, '..', '..', '..', '..', 'assets', foundAsset.filename);
    fs.unlinkSync(pathToFile);

    root.io.emit('delete-asset', removedAsset);
    return removedAsset;
  },
};
