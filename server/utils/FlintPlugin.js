const events = require('./events');
const path = require('path');
const chalk = require('chalk');

/**
 * Flint Plugin Class
 * @property {String} name
 */
class FlintPlugin {
  constructor(schema) {
    this.init(schema, events);
  }

  static get uid() {
    // eslint-disable-next-line no-console
    console.log(__dirname);
    // console.error(chalk.red('A plugin forgot to set a static getter for the uid. See https://flintcms.co/docs/plugins for more information.'));
  }

  /**
   * @type {String}
   */
  static get name() { return ''; }

  /**
   * @type {String}
   */
  static get icon() { return path.join(__dirname, 'icon.png'); }

  /**
   * @type {object}
   */
  static get model() { return {}; }

  init() {
    /* eslint-disable no-console */
    console.log(`Welcome to the ${this.name} plugin! You have forgotten to create your init class method. Oh well :(`);
    console.log('The init method of your plugin is the entry point for Flint to know how to deal with the plugin, set up hooks and generally deal with the plugin.');
  }
}

module.exports = FlintPlugin;
