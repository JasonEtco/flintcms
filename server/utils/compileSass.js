const sass = require('node-sass');
const path = require('path');
const chalk = require('chalk');
const scaffold = require('./scaffold');
const { writeFileAsync } = require('./fsPromises');

function sassAsync(opt) {
  return new Promise((resolve, reject) => {
    sass.render(opt, (err, res) => {
      if (err) reject(err);
      resolve(res);
    });
  });
}

/**
 * Compiles SASS using the scssEntryPoint config
 */
async function compileSass() {
  if (global.FLINT.scssEntryPoint) {
    const opts = {
      file: path.join(global.FLINT.scssPath, global.FLINT.scssEntryPoint),
      outputStyle: process.env.NODE_ENV === 'production' ? 'compressed' : 'nested',
    };

    try {
      const scss = await sassAsync(opts);

      const cssPath = path.join(global.FLINT.publicPath);
      const p = await scaffold(cssPath);
      const filename = global.FLINT.scssEntryPoint.replace('.scss', '.css');
      const pathToFile = path.join(p, filename);

      await writeFileAsync(pathToFile, scss.css);
      return `${chalk.grey('[SCSS]')} Your SCSS has been compiled to ${pathToFile}`;
    } catch (e) {
      return chalk.magenta('There was an error compiling your SCSS. Check your site configuration.');
    }
  }

  return chalk.grey('SCSS compiling has been disabled in the site configuration.');
}

module.exports = compileSass;
