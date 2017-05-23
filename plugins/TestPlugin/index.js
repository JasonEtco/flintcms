const FlintPlugin = require('../../server/utils/FlintPlugin');

class TestPlugin extends FlintPlugin {
  static get name() { return 'Test Plugin'; }
  static get icon() { return 'icon.png'; }

  init(schema) {
    if (schema.name === 'Entry') {
      schema.pre('validate', function (next) {
        console.log('Saving!');
        console.log(this);
        next();
      });
    }
  }
}

module.exports = TestPlugin;
