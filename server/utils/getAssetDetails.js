const jimp = require('jimp');
const { statAsync } = require('./fsPromises');

module.exports = async (pathToFile) => {
  const { size } = await statAsync(pathToFile).catch(err => new Error(err));
  const {
    _originalMime: mimetype,
    bitmap: { width, height },
  } = await jimp.read(pathToFile);

  return { mimetype, width, height, size };
};
