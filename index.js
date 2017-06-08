require('dotenv').config();

const path = require('path');
const generateEnvFile = require('./server/utils/generateEnvFile');
const validateEnvVariables = require('./server/utils/validateEnvVariables');
const scaffold = require('./server/utils/scaffold');

/**
 * @typedef {Object} FLINT
 * @property {String} templatePath - Path to your templates directory
 * @property {String} scssPath - Path to your scss directory
 * @property {String} publicPath - Path to your public directory
 * @property {String} scssEntryPoint - The entry point to your SCSS styles (within the scssPath)
 * @property {String} siteName - The title of your site
 * @property {String} siteUrl - The URL to your site
 * @property {Function[]} plugins - Array of required Class modules
 */

/**
 * Flint class
 * @class
 */
exports.Flint = class Flint {
  /**
   * Create a Flint server
   * @param {FLINT} settings
   * @param {boolean} debugMode
   */
  constructor(settings, debugMode) {
    const appDir = path.dirname(require.main.filename);
    const { templatePath, scssPath, publicPath, plugins, scssEntryPoint } = settings;

    const FLINT = Object.assign({}, settings, {
      templatePath: path.join(appDir, templatePath || 'templates'),
      scssPath: path.join(appDir, scssPath || 'scss'),
      publicPath: path.join(appDir, publicPath || 'public'),
      plugins: plugins || [],
      scssEntryPoint: scssEntryPoint || 'main.scss',
      debugMode,
      appDir,
    });

    global.FLINT = FLINT;

    scaffold(FLINT.templatePath);
    scaffold(FLINT.scssPath);
    scaffold(FLINT.publicPath);

    this.port = process.env.PORT || 4000;
  }

  startServer(port = this.port) {
    const missingEnvVariables = validateEnvVariables();
    const shouldContinue = generateEnvFile() && missingEnvVariables.length === 0;

    if (shouldContinue) {
      // eslint-disable-next-line global-require
      const { startServer } = require('./server');
      startServer(port);
    }
  }
};

exports.FlintPlugin = require('./server/utils/FlintPlugin');
