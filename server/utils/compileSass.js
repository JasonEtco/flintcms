const sass = require('node-sass');
const path = require('path');
const fs = require('fs');

/**
 * Compiles SASS using the scssEntryPoint config
 */
async function compileSass() {
  sass.render({
    file: path.join(global.FLINT.scssPath, 'main.scss'),
    outputStyle: process.env.NODE_ENV === 'production' ? 'compressed' : 'nested',
  }, async (err, res) => {
    const cssPath = path.join(global.FLINT.publicPath);
    if (!fs.existsSync(cssPath)) {
      fs.mkdirSync(cssPath);
    }

    fs.writeFileSync(path.join(cssPath, 'main.css'), res.css);
  });

  // return compiled;
}

module.exports = compileSass;
