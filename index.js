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
  constructor(settings, siteConfig) {
    const appDir = path.dirname(require.main.filename);
    const { templatePath, scssPath, publicPath, configPath } = settings;

    const formattedSettings = {
      templatePath: path.join(appDir, templatePath || 'templates'),
      scssPath: path.join(appDir, scssPath || 'scss'),
      publicPath: path.join(appDir, publicPath || 'public'),
      configPath: path.join(appDir, configPath || 'config'),
      siteConfig,
    };

    const isDeveloping = process.env.NODE_ENV !== 'production';
    this.port = isDeveloping ? 4000 : process.env.PORT;

    this.settings = formattedSettings;
    global.FlintSettings = formattedSettings;
  }

  startServer(port = this.port) {
    const { startServer } = require('./server');
    console.log(startServer);
    startServer(port);
  }
};
