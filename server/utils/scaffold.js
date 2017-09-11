const fs = require('fs');
const { promisify } = require('util');

const mkdirAsync = promisify(fs.mkdir);
/**
 * Creates a directory at the given path if it does not already exist.
 * @param {String} path - Path to the directory
 */
function scaffold(path) {
  return new Promise((resolve) => {
    if (!fs.existsSync(path)) {
      return mkdirAsync(path).then(() => resolve(path));
    }
    return resolve(path);
  });
}

module.exports = scaffold;
