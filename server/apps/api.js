/* eslint-disable global-require */

const express = require('express');
const chalk = require('chalk');
const log = require('debug')('flint');

module.exports = (app) => {
  const api = express();

  api.use(require('./routes/assets')(app));
  api.use(require('./routes/site')());
  api.use(require('./routes/logs')());

  log(`${chalk.gray('[App: API]')} initialized.`);
  return api;
};
