const { GraphQLList, GraphQLObjectType } = require('graphql');
const path = require('path');
const fs = require('fs');
const getAssetDetails = require('../../../utils/getAssetDetails');
const mongoose = require('mongoose');
const { outputType } = require('../../types/Assets');
const { readdirAsync } = require('../../../utils/fsPromises');

const pathToAssets = path.join(__dirname, '..', '..', '..', '..', 'public', 'assets');
const Asset = mongoose.model('Asset');

/**
 * Removes file documents from the database
 * @param {Object[]} dbFiles - Array of Files from the DataBase
 * @returns {Object[]} An array of file objects that were deleted
 */
async function removeFiles(dbFiles) {
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
async function saveFiles(dbFiles) {
  const files = await readdirAsync(pathToAssets);
  files.filter(f =>
      // Check if file is in list of indexed assets
      dbFiles.findIndex(dbf => dbf.filename === f) === -1

      // TODO: Allow for other file types
      && f.match(/\.(jpe?g|png|gif|svg)$/i))
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
    // TODO: Use Promise.all to have
    // removedFiles/savedFiles run at the same time

    // List of all assets already indexed
    const dbFiles = await Asset.find().exec();

    // const savedFiles = await saveFiles(dbFiles);
    // const removedFiles = await removeFiles(dbFiles);
    const vals = await Promise.all([
      saveFiles(dbFiles),
      removeFiles(dbFiles),
    ]);

    console.log(vals);

    // return Promise.all([savedFiles, removedFiles])
    //   .then(values => ({ savedFiles: values[0], removedFiles: values[1] }))
    //   .catch(error => new Error(error));

    if (!savedFiles || !removedFiles) throw new Error('There was a problem indexing the assets.');
    return { savedFiles, removedFiles };
  },
};
