const sass = require('node-sass');
const path = require('path');
const fs = require('fs');
const chalk = require('chalk');
const chokidar = require('chokidar');
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
 * Actually compiles the SCSS
 * @param {object} opts - Compile options
 */
async function compile() {
  const opts = {
    file: path.join(global.FLINT.scssPath, global.FLINT.scssEntryPoint),
    outputStyle: process.env.NODE_ENV === 'production' ? 'compressed' : 'nested',
    includePaths: global.FLINT.scssIncludePaths,
  };

  try {
    const scss = await sassAsync(opts);

    const cssPath = path.join(global.FLINT.publicPath);
    const p = await scaffold(cssPath);
    const filename = global.FLINT.scssEntryPoint.replace('.scss', '.css');
    const pathToFile = path.join(p, filename);
    if (!fs.existsSync(pathToFile)) return `${chalk.red('[SCSS]')} The scssEntryPoint does not exist.`;

    await writeFileAsync(pathToFile, scss.css);
    return `${chalk.grey('[SCSS]')} Your SCSS has been compiled to ${pathToFile}`;
  } catch (e) {
    /* eslint-disable no-console */
    console.log(`  ${chalk.grey('Message:')} ${chalk.red(e.message)}`);
    console.log(`  ${chalk.grey('Line:')} ${chalk.red(e.line)}`);
    console.log(`  ${chalk.grey('File:')} ${chalk.red(e.file)}`);
    /* eslint-enable no-console */

    return `${chalk.red('[SCSS]')} There was an error compiling your SCSS.`;
  }
}

function recompile() {
  // eslint-disable-next-line no-console
  console.log(chalk.cyan('Recompiling SASS...'));
  return compile();
}

function watch(watcher) {
  watcher.on('add', async () => {
    const compiled = await recompile();
    console.log(compiled); // eslint-disable-line no-console
  });
  watcher.on('change', async () => {
    const compiled = await recompile();
    console.log(compiled); // eslint-disable-line no-console
  });
}

/**
 * Compiles SASS using the scssEntryPoint config
 */
async function compileSass() {
  if (global.FLINT.scssEntryPoint) {
    if (global.FLINT.debugMode) {
      const watcher = chokidar.watch(global.FLINT.scssPath, {
        persistent: true,
        ignoreInitial: true,
      });

      watch(watcher);
    }

    return compile();
  }

  return chalk.grey('SCSS compiling has been disabled in the site configuration.');
}

module.exports = compileSass;
