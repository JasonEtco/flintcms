const {
  GraphQLList,
} = require('graphql');
const fs = require('fs');
const path = require('path');
const getAssetDetails = require('../../../utils/getAssetDetails');
const mongoose = require('mongoose');
const { outputType } = require('../../types/Assets');

const Asset = mongoose.model('Asset');

function fsDirPromise(pathToAssets) {
  return new Promise((resolve, reject) => {
    fs.readdir(pathToAssets, (err, files) => {
      if (err) reject(err);
      else resolve(files);
    });
  });
}

function fsStatPromise(file) {
  return new Promise((resolve, reject) => {
    fs.stat(file, (err, f) => {
      if (err) reject(err);
      else resolve(f);
    });
  });
}

module.exports = {
  type: new GraphQLList(outputType),
  args: {},
  async resolve(root) {
    const pathToAssets = path.join(__dirname, '..', '..', '..', '..', 'assets');
    const files = await fsDirPromise(pathToAssets);

    const savedFiles = await files.map(async (file) => {
      const fileInDB = await Asset.findOne({ filename: file });

      if (!fileInDB) {
        const pathToFile = path.resolve(pathToAssets, file);
        const { size } = await fsStatPromise(pathToFile).catch(err => new Error(err));
        const { width, height, mimetype } = await getAssetDetails(pathToFile);

        const newAsset = new Asset();

        newAsset.title = file;
        newAsset.filename = file;
        newAsset.filesize = size;
        newAsset.width = width;
        newAsset.height = height;
        newAsset.mimetype = mimetype;

        const savedAsset = await newAsset.save();
        if (!savedAsset) throw new Error('There was a problem saving the asset.');

        root.io.emit('new-asset', savedAsset);
        return savedAsset;
      }

      return false;
    });

    return savedFiles;
  },
};
