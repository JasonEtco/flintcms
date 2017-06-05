const express = require('express');
const chalk = require('chalk');

const api = express();

api.use(require('./routes/templates'));
api.use(require('./routes/assets'));
api.use(require('./routes/site'));

// eslint-disable-next-line no-console
console.log(`${chalk.gray('[App: API]')} initialized.`);
module.exports = api;
