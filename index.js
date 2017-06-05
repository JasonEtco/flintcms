const path = require('path');

/**
 * @typedef {Object} FlintSettings
 * @property {String} templatePath - Path to your templates directory
 * @property {String} scssPath - Path to your scss directory
 * @property {String} publicPath - Path to your public directory
 * @property {String} configPath - Path to your config file
 */

/**
 * Flint class
 */
module.exports = class Flint {
  /**
   * Create a Flint server
   * @param {FlintSettings} settings
   */
  constructor(settings, isDeveloping) {
    const appDir = path.dirname(require.main.filename);
    const { templatePath, scssPath, publicPath, configPath } = settings;

    const formattedSettings = Object.assign({}, settings, {
      templatePath: path.join(appDir, templatePath || 'templates'),
      scssPath: path.join(appDir, scssPath || 'scss'),
      publicPath: path.join(appDir, publicPath || 'public'),
      configPath: path.join(appDir, configPath || 'config'),
      isDeveloping,
    });

    this.port = !isDeveloping && process.env.PORT ? process.env.PORT : 4000;

    global.FlintSettings = formattedSettings;
  }

  startServer(port = this.port) {
    const { startServer } = require('./server');
    startServer(port);
  }
};