const path = require('path');
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
  static get icon() { return path.join(__dirname, this.icon); }

  init(m) {
    // eslint-disable-next-line no-console
    console.log(`Welcome to the ${this.name} plugin! You have forgotten to create your init class method. Oh well :(`);
    console.log('On the bright side, you have access to these models!');

    console.log(m);
  }
}

module.exports = FlintPlugin;
