const {
  GraphQLList,
} = require('graphql');
const path = require('path');
const getAssetDetails = require('../../../utils/getAssetDetails');
const mongoose = require('mongoose');
const { outputType } = require('../../types/Assets');
const { readdirAsync } = require('../../../utils/fsPromises');

const Asset = mongoose.model('Asset');

module.exports = {
  type: new GraphQLList(outputType),
  args: {},
  async resolve(root) {
    const pathToAssets = path.join(__dirname, '..', '..', '..', '..', 'assets');
    const files = await readdirAsync(pathToAssets);

    const savedFiles = await files.map(async (file) => {
      const fileInDB = await Asset.findOne({ filename: file });
      if (fileInDB) return fileInDB;

      const pathToFile = path.resolve(pathToAssets, file);
      const { width, height, mimetype, size } = await getAssetDetails(pathToFile);

      const newAsset = new Asset({
        title: file,
        filename: file,
        size,
        width,
        height,
        mimetype,
      });

      const savedAsset = await newAsset.save();
      if (!savedAsset) throw new Error('There was a problem saving the asset.');

      root.io.emit('new-asset', savedAsset);
      return savedAsset;
    });

    return savedFiles;
  },
};
