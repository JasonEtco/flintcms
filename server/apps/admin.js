/* eslint-disable no-console */

const express = require('express');
const path = require('path');
const chalk = require('chalk');
const webpack = require('webpack');
const webpackMiddleware = require('webpack-dev-middleware');
const webpackHotMiddleware = require('webpack-hot-middleware');
const config = require('../../config/webpack.config');

const admin = express();

admin.use(require('./routes/auth'));
admin.use('/api', require('./api'));

if (global.FLINT.isDeveloping) {
  const compiler = webpack(config);
  const middleware = webpackMiddleware(compiler, {
    publicPath: '/',
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

  admin.get('*', (req, res) => {
    res.write(middleware.fileSystem.readFileSync(path.join(__dirname, '..', '..', 'admin', 'index.html')));
    res.end();
  });

  console.log(`${chalk.cyan('[App: Admin]')} initialized in Dev mode.`);
} else {
  const STATIC_PATH = path.join(__dirname, '..', '..', 'admin');
  const STATIC_OPTS = {
    maxAge: 31536000000, // One year
  };

  admin.use(express.static(STATIC_PATH, STATIC_OPTS));

  admin.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '..', '..', 'admin', 'index.html'));
  });
  console.log(`${chalk.gray('[App: Admin]')} initialized.`);
}

module.exports = admin;
