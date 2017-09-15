const Flint = require('../../../index');
const path = require('path');

const FlintPlugin = Flint.FlintPlugin;

class SecondPlugin extends FlintPlugin {
  static get uid() {
    return 'second-plugin';
  }

  static get title() {
    return 'Second Plugin';
  }

  static get version() {
    return '1.0.0';
  }

  static get icon() { return path.join(__dirname, 'icon.png'); }
}

module.exports = SecondPlugin;
