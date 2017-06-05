const path = require('path');

/**
 * @typedef {Object} FLINT
 * @property {String} templatePath - Path to your templates directory
 * @property {String} scssPath - Path to your scss directory
 * @property {String} publicPath - Path to your public directory
 * @property {String} pluginPath - Path to your plugins directory
 * @property {String} configPath - Path to your config file
 * @property {String} scssEntryPoint - The entry point to your SCSS styles (within the scssPath)
 */

/**
 * Flint class
 */
exports.Flint = class Flint {
  /**
   * Create a Flint server
   * @param {FLINT} settings
   * @param {boolean} isDeveloping
   */
  constructor(settings, isDeveloping) {
    const appDir = path.dirname(require.main.filename);
    const { templatePath, scssPath, publicPath, configPath, pluginPath } = settings;

    const formattedSettings = Object.assign({}, settings, {
      templatePath: path.join(appDir, templatePath || 'templates'),
      scssPath: path.join(appDir, scssPath || 'scss'),
      publicPath: path.join(appDir, publicPath || 'public'),
      configPath: path.join(appDir, configPath || 'config'),
      pluginPath: path.join(appDir, pluginPath || 'plugins'),
      isDeveloping,
    });

    this.port = !isDeveloping && process.env.PORT ? process.env.PORT : 4000;

    global.FLINT = formattedSettings;
  }

  startServer(port = this.port) {
    // eslint-disable-next-line global-require
    const { startServer } = require('./server');
    startServer(port);
  }
};

exports.FlintPlugin = require('./server/utils/FlintPlugin');
