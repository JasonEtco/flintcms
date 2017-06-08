const sass = require('node-sass');
const path = require('path');
const fs = require('fs');
const chalk = require('chalk');
const scaffold = require('./scaffold');

/**
 * Compiles SASS using the scssEntryPoint config
 */
async function compileSass() {
  if (global.FLINT.scssEntryPoint) {
    sass.render({
      file: path.join(global.FLINT.scssPath, global.FLINT.scssEntryPoint),
      outputStyle: process.env.NODE_ENV === 'production' ? 'compressed' : 'nested',
    }, async (err, res) => {
      if (err) {
        // eslint-disable-next-line no-console
        console.error(chalk.magenta('There was an error compiling your SCSS. Check your site configuration.'));
      } else {
        const cssPath = path.join(global.FLINT.publicPath);
        const p = await scaffold(cssPath);
        fs.writeFileSync(path.join(p, 'main.css'), res.css);
      }
    });
  }
}

module.exports = compileSass;
