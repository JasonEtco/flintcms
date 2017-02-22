const express = require('express');
const path = require('path');
const webpack = require('webpack');
const webpackMiddleware = require('webpack-dev-middleware');
const webpackHotMiddleware = require('webpack-hot-middleware');
const config = require('../../config/webpack.config');

const admin = express();

const isDeveloping = process.env.NODE_ENV !== 'production';

admin.use(require('./routes/auth'));
admin.use('/api', require('./api'));

if (isDeveloping) {
  console.log('Development mode!');
  const compiler = webpack(config);
  const middleware = webpackMiddleware(compiler, {
    publicPath: config.output.publicPath,
    stats: {
      colors: true,
      hash: false,
      timings: true,
      chunks: false,
      chunkModules: false,
      modules: false,
    },
  });

  admin.use(middleware);
  admin.use(webpackHotMiddleware(compiler));

  admin.get('/main.js', (req, res) => {
    res.write(middleware.fileSystem.readFileSync(path.join(__dirname, '..', '..', 'main.js')));
    res.end();
  });

  admin.get('*', (req, res) => {
    res.write(middleware.fileSystem.readFileSync(path.join(__dirname, '..', '..', 'index.html')));
    res.end();
  });
} else {
  const STATIC_PATH = path.join(__dirname, '..', '..', 'admin');
  const STATIC_OPTS = {
    maxAge: 31536000000, // One year
  };

  admin.use(express.static(STATIC_PATH, STATIC_OPTS));

  admin.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '..', '..', 'admin', 'index.html'));
  });
}

console.log('[App: Admin] initialized.');
module.exports = admin;
