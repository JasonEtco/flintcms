const events = require('./events');

/**
 * Flint Plugin Class
 * @property {String} name
 */
class FlintPlugin {
  constructor(schema) {
    this.init(schema, events);
  }

  /**
   * @type {String}
   */
  static get name() { return ''; }

  /**
   * @type {String}
   */
  static get icon() { return 'icon.png'; }

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
