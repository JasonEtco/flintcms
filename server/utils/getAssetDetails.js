const jimp = require('jimp');

module.exports = async (pathToFile) => {
  const {
    _originalMime: mimetype,
    bitmap: { width, height },
  } = await jimp.read(pathToFile);

  return { mimetype, width, height };
};
