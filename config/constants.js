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
    assets: path.join(__dirname, '..', 'app', 'assets'),
  },
};

exports.vendor = [
  'react',
  'react-dom',
  'react-router',
  'codemirror',
  'react-codemirror',
  'socket.io-client',
  'socket.io-parser',
  'engine.io-client',
  'engine.io-parser',
  'lodash',
  'moment',
  'draft-js',
  'draft-js-export-html',
  'draft-js-utils',
  'react-color',
  'react-redux',
  'redux',
  'immutability-helper',
  'immutable',
  'history',
  'axios',
  'react-dnd',
  'react-dnd-html5-backend',
  'core-js',
  'react-rte',
];
