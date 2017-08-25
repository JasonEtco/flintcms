/* eslint-disable global-require */

const express = require('express');
const chalk = require('chalk');

module.exports = (app) => {
  const api = express();

  api.use(require('./routes/templates'));
  api.use(require('./routes/assets')(app));
  api.use(require('./routes/site'));
  api.use(require('./routes/logs'));

  const testing = process.env.NODE_ENV === 'test';

  // eslint-disable-next-line no-console
  if (!testing) console.log(`${chalk.gray('[App: API]')} initialized.`);
  return api;
};
