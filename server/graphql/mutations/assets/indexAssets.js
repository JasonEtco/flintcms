const { GraphQLList, GraphQLObjectType } = require('graphql');
const path = require('path');
const fs = require('fs');
const getAssetDetails = require('../../../utils/getAssetDetails');
const mongoose = require('mongoose');
const { outputType } = require('../../types/Assets');
const { readdirAsync } = require('../../../utils/fsPromises');

const Asset = mongoose.model('Asset');

/**
 * Removes file documents from the database
 * @param {Object[]} dbFiles - Array of Files from the DataBase
 * @returns {Object[]} An array of file objects that were deleted
 */
async function removeFiles(dbFiles, pathToAssets) {
  const removedFiles = await dbFiles
    .filter(file => !fs.existsSync(path.join(pathToAssets, file.filename)))
    .map(async (file) => {
      const deleted = await Asset.findByIdAndRemove(file._id);
      if (!deleted) throw new Error(`There was a problem deleting an asset: ${file._id}`);
      return file;
    });
  return removedFiles;
}

/**
 * Adds files to the database from the local file system
 * @param {Object[]} dbFiles - Array of Files from the DataBase
 * @returns {Object[]} An array of file objects that were saved
 */
async function saveFiles(dbFiles, pathToAssets) {
  const files = await readdirAsync(pathToAssets);
  const savedFiles = await files
    .filter(f =>
      dbFiles.findIndex(dbf => dbf.filename === f) === -1 &&
      f.match(/(?:gif|jpg|png|bmp|jpeg)$/))
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
  return savedFiles;
}

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
    const pathToAssets = path.join(__dirname, '..', '..', '..', '..', 'public', 'assets');
    const dbFiles = await Asset.find().exec();

    const [savedFiles, removedFiles] = await Promise.all([
      saveFiles(dbFiles, pathToAssets),
      removeFiles(dbFiles, pathToAssets),
    ]);
    return { savedFiles, removedFiles };
  },
};
