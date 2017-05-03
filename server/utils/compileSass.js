const sass = require('node-sass');
const path = require('path');
const fs = require('fs');
const { scssEntryPoint } = require('../../config');

/**
 * Compiles SASS using the scssEntryPoint config
 */
async function compileSass() {
  const pathToSCSS = path.join(__dirname, '..', '..', path.normalize(scssEntryPoint));
  sass.render({
    file: pathToSCSS,
    outputStyle: process.env.NODE_ENV === 'production' ? 'compressed' : 'nested',
  }, async (err, res) => {
    const cssPath = path.join(__dirname, '..', '..', 'public');
    if (!fs.existsSync(cssPath)) {
      fs.mkdirSync(cssPath);
    }

    fs.writeFileSync(path.join(cssPath, 'main.css'), res.css);
  });

  // return compiled;
}

module.exports = compileSass;
