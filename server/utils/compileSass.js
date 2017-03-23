const sass = require('node-sass');
const path = require('path');
const fs = require('fs');
const { writeFileAsync } = require('./fsPromises');
const { scssEntryPoint } = require('../../config');

/**
 * Compiles SASS using the scssEntryPoint config
 */
async function compileSass() {
  const pathToSCSS = path.join(__dirname, '..', '..', path.normalize(scssEntryPoint));
  sass.render({
    file: pathToSCSS,
  }, async (err, res) => {
    const cssPath = path.join(__dirname, '..', '..', 'public');
    if (!fs.existsSync(cssPath)) {
      fs.mkdirSync(cssPath);
    }

    const file = await writeFileAsync(path.join(cssPath, 'main.css'), res.css);
    console.log(file);
  });

  // return compiled;
}

module.exports = compileSass;
