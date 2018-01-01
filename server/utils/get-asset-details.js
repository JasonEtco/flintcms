const jimp = require('jimp');
const { promisify } = require('util');
const fs = require('fs');

const statAsync = promisify(fs.stat);

/**
 * Gets the mimetype, width, height and file size of an asset.
 * @param {String} pathToFile
 *
 * @typedef {Object} AssetDetails
 * @property {string} mimetype - MimeType of the asset
 * @property {number} width - Width of the asset
 * @property {number} height - Height of the asset
 * @property {number} size - File size in bytes
 *
 * @returns {AssetDetails}
 */
async function getAssetDetails(pathToFile) {
  const { size } = await statAsync(pathToFile).catch(err => new Error(err));
  const {
    _originalMime: mimetype,
    bitmap: { width, height },
  } = await jimp.read(pathToFile);

  return { mimetype, width, height, size };
}

module.exports = getAssetDetails;
