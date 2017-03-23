const { GraphQLList, GraphQLObjectType } = require('graphql');
const path = require('path');
const fs = require('fs');
const getAssetDetails = require('../../../utils/getAssetDetails');
const mongoose = require('mongoose');
const { outputType } = require('../../types/Assets');
const { readdirAsync } = require('../../../utils/fsPromises');

const pathToAssets = path.join(__dirname, '..', '..', '..', '..', 'public', 'assets');
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
  async resolve() {
    // TODO: Use Promise.all to have
    // removedFiles/savedFiles run at the same time

    // List of all assets already indexed
    const dbFiles = await Asset.find().exec();

    // If there is a file in the directory, but does not exist
    // in the DB, we should add it to the DB.

    // Get current file list
    const files = await readdirAsync(pathToAssets);

    // Filter out assets already in DB, and assets of wrong format
    const savedFiles = await files.filter(f =>
      // Check if file is in list of indexed assets
      dbFiles.findIndex(dbf => dbf.filename === f) === -1

      // TODO: Allow for other file types
      && f.match(/(?:gif|jpg|png|bmp|jpeg)$/))
    .map(async (file) => {
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


    // If there is a document in the DB, but the file doesn't exists
    // we should remove it from the DB
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
