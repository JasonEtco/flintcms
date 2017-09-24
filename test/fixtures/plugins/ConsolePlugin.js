/* eslint-disable class-methods-use-this */

const Flint = require('../../../index');
const path = require('path');

const FlintPlugin = Flint.FlintPlugin;

class ConsolePlugin extends FlintPlugin {
  static get uid() { return 'console-plugin'; }
  static get title() { return 'Console Plugin'; }
  static get version() { return '1.0.0'; }
  static get icon() { return path.join(__dirname, 'icon.png'); }

  init() {}
}

module.exports = ConsolePlugin;
