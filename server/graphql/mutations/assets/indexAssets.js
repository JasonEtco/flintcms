const { GraphQLList, GraphQLObjectType } = require('graphql');
const path = require('path');
const fs = require('fs');
const getAssetDetails = require('../../../utils/getAssetDetails');
const mongoose = require('mongoose');
const { outputType } = require('../../types/Assets');
const { readdirAsync } = require('../../../utils/fsPromises');

const Asset = mongoose.model('Asset');

module.exports = {
  type: new GraphQLObjectType({
    name: 'AssetIndexer',
    fields: {
      savedFiles: { type: new GraphQLList(outputType) },
      removedFiles: { type: new GraphQLList(outputType) },
    },
  }),
  args: {},
  async resolve(root) {
    const pathToAssets = path.join(__dirname, '..', '..', '..', '..', 'assets');
    const files = await readdirAsync(pathToAssets);

    // TODO: Allow for other file types
    const filtered = await files
      .filter(f => f.match(/(?:gif|jpg|png|bmp|jpeg)$/))
      .filter(async (f) => {
        const fileInDB = await Asset.findOne({ filename: f }).exec();
        return !fileInDB;
      });

    const savedFiles = await filtered.map(async (file) => {
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
      if (!savedAsset) throw new Error(`There was a problem saving the asset: ${file}.`);
      return savedAsset;
    });

    const dbFiles = await Asset.find().exec();
    const removedFiles = await dbFiles
      .filter(file => !fs.existsSync(path.join(pathToAssets, file.filename)))
      .map(async (file) => {
        const deleted = await Asset.findByIdAndRemove(file._id);
        if (!deleted) throw new Error(`There was a problem deleting an asset: ${file._id}`);
        return file;
      });

    if (!savedFiles || !removedFiles) throw new Error('There was a problem indexing the assets.');
    return { savedFiles, removedFiles };
  },
};
