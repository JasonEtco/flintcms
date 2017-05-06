const path = require('path');

exports.browsers = [
  'last 2 versions',
  'ios_saf >= 8',
  'ie >= 10',
  'chrome >= 49',
  'firefox >= 49',
  '> 1%',
];

exports.resolve = {
  alias: {
    components: path.join(__dirname, '..', 'app', 'components'),
    containers: path.join(__dirname, '..', 'app', 'containers'),
    views: path.join(__dirname, '..', 'app', 'views'),
    actions: path.join(__dirname, '..', 'app', 'actions'),
    utils: path.join(__dirname, '..', 'app', 'utils'),
  },
};
