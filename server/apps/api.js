const express = require('express');

const api = express();

function loggedIn(req, res, next) {
  if (req.user !== undefined) {
    next();
  } else {
    res.json({ status: 401, redirect: '/admin/login' });
  }
}

api.use(loggedIn);

api.use(require('./routes/templates'));
api.use(require('./routes/user'));
api.use(require('./routes/assets'));

console.log('[App: API] initialized.');
module.exports = api;
