const events = require('./events')
const path = require('path')
const logger = require('./logger')

/**
 * Flint Plugin Class
 * @property {String} name
 */
class FlintPlugin {
  constructor (schema) {
    this.logger = logger
    this.init(schema, events)
  }

  static get uid () {
    this.logger.error('A plugin forgot to set a static getter for the uid. See https://flintcms.co/docs/plugins for more information.')
    return false
  }

  /**
   * @type {String}
   */
  static get title () { return '' }

  /**
   * @type {String}
   */
  static get icon () { return path.join(__dirname, 'icon.png') }

  /**
   * @type {object}
   */
  static get model () { return {} }

  init () {
    this.logger.error(`Welcome to the ${this.name} plugin! You have forgotten to create your init class method. Oh well :(`)
    this.logger.error('The init method of your plugin is the entry point for Flint to know how to deal with the plugin, set up hooks and generally deal with the plugin.')
  }
}

module.exports = FlintPlugin
