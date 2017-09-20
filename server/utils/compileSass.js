const sass = require('node-sass');
const path = require('path');
const fs = require('fs');
const chalk = require('chalk');
const chokidar = require('chokidar');
const scaffold = require('./scaffold');
const { promisify } = require('util');
const log = require('debug')('flint:scss');
const mongoose = require('mongoose');

const writeFileAsync = promisify(fs.writeFile);
const unlink = promisify(fs.unlink);

function sassAsync(opt) {
  return new Promise((resolve, reject) => {
    sass.render(opt, (err, res) => {
      /* istanbul ignore if */
      if (err) reject(err);
      resolve(res);
    });
  });
}

function generateHash(length = 16) {
  const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let retVal = '';

  for (let i = 0, n = charset.length; i < length; ++i) {
    retVal += charset.charAt(Math.floor(Math.random() * n));
  }
  return retVal;
}

const appendHash = (str, hash) => str.replace('.css', `-${hash}.css`);

/**
 * @typedef {Object} CacheBusted
 * @property {string} file - File name ending in .css
 * @property {string} [oldFile] - The old file, if cache busting is enabled.
 * @property {string} [newHash] - The new hash, if one was generated.
 *
 * Generates a hash and adds the hash to the db's site document.
 * @param {string} filename - File name, sans extension.
 * @returns {CacheBusted}
 */
async function handleCacheBusting(filename) {
  const file = `${filename}.css`;
  if (!global.FLINT.enableCacheBusting) return { file };

  const Site = mongoose.model('Site');
  const site = await Site.findOne().exec();
  const cssHash = generateHash();
  global.FLINT.cssHash = cssHash;
  const updatedSite = await Site.findByIdAndUpdate(site._id, { cssHash }, { new: true }).exec();

  /* istanbul ignore if */
  if (!updatedSite) throw new Error('Could not save the site config to the database.');
  return {
    file: appendHash(file, cssHash),
    oldFile: appendHash(file, site.cssHash),
    newHash: cssHash,
  };
}

/**
 * Actually compiles the SCSS
 * @returns {string}
 */
async function compile() {
  /* istanbul ignore next */
  const outputStyle = process.env.NODE_ENV === 'production' ? 'compressed' : 'nested';

  const opts = {
    file: path.join(global.FLINT.scssPath, global.FLINT.scssEntryPoint),
    includePaths: global.FLINT.scssIncludePaths,
    outputStyle,
  };

  const fileSplit = global.FLINT.scssEntryPoint.split('.');
  const filename = fileSplit.slice(0, fileSplit.length - 1).join('.');

  try {
    const scss = await sassAsync(opts);
    const { file, oldFile } = await handleCacheBusting(filename);
    const pathToFile = path.join(await scaffold(global.FLINT.publicPath), file);

    await writeFileAsync(pathToFile, scss.css);

    // Delete the old file
    if (global.FLINT.enableCacheBusting && oldFile) {
      const pathToOldFile = path.join(global.FLINT.publicPath, oldFile);
      const exists = fs.existsSync(pathToOldFile);
      if (exists) {
        log('Deleting old bundle.');
        await unlink(pathToOldFile);
      }
    }

    return `${chalk.grey('[SCSS]')} Your SCSS has been compiled to ${pathToFile}`;
  } catch (e) /* istanbul ignore next */ {
    log(`  ${chalk.grey('Message:')} ${chalk.red(e.message)}`);
    log(`  ${chalk.grey('Line:')} ${chalk.red(e.line)}`);
    log(`  ${chalk.grey('File:')} ${chalk.red(e.file)}`);

    return `${chalk.red('[SCSS]')} There was an error compiling your SCSS.`;
  }
}

/* istanbul ignore next */
function recompile() {
  // eslint-disable-next-line no-console
  log(chalk.cyan('Recompiling SASS...'));
  return compile();
}

/* istanbul ignore next */
function watch(watcher) {
  watcher.on('add', async () => {
    const compiled = await recompile();
    log(compiled); // eslint-disable-line no-console
  });
  watcher.on('change', async () => {
    const compiled = await recompile();
    log(compiled); // eslint-disable-line no-console
  });
}

/**
 * Compiles SASS using the scssEntryPoint config
 */
async function compileSass() {
  if (global.FLINT.scssEntryPoint) {
    /* istanbul ignore if */
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
