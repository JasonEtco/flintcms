const FlintPlugin = require('../server/utils/FlintPlugin');

class TestPlugin extends FlintPlugin {
  static get name() { return 'Test Plugin'; }

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
