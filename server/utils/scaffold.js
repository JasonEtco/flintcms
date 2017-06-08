const fs = require('fs');
const { mkdirAsync } = require('./fsPromises');

/**
 * Creates a directory at the given path if it does not already exist.
 */
function scaffold(path) {
  return new Promise((resolve) => {
    if (!fs.existsSync(path)) {
      return mkdirAsync(path);
    }
    return resolve(path);
  });
}

module.exports = scaffold;
