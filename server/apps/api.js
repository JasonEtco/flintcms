const express = require('express');

const api = express();

api.use(require('./routes/templates'));
api.use(require('./routes/assets'));
api.use(require('./routes/site'));

// eslint-disable-next-line no-console
console.log('[App: API] initialized.');
module.exports = api;
