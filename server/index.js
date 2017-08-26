/* eslint-disable no-console, global-require */

const express = require('express');
const chalk = require('chalk');
const session = require('cookie-session');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const path = require('path');
const compression = require('compression');
const passport = require('passport');
const fs = require('fs');
const { Server } = require('http');
const io = require('socket.io');
const shutter = require('http-shutdown');

module.exports = (port) => {
  require('./utils/passport')(passport);

  const app = express();
  const server = shutter(Server(app));
  app.set('io', io(server));

  const accessLogStream = fs.createWriteStream(path.join(global.FLINT.logsPath, 'http-requests.log'), { flags: 'a' });
  app.use(morgan('combined', { stream: accessLogStream }));

  app.use(cookieParser());
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(bodyParser.json());
  app.use(session({ secret: process.env.SESSION_SECRET }));

  app.use(passport.initialize());
  app.use(passport.session());

  app.use(compression());

  // `/ping` endpoint for testing and uptime monitoring
  app.get('/ping', (req, res) => res.end('PONG'));

  app.use('/public', express.static(global.FLINT.publicPath));
  app.use('/manifest.json', express.static(path.join(__dirname, '..', 'manifest.json')));
  app.use('/admin', require('./apps/admin')(app));
  app.use('/graphql', require('./apps/graphql')(app));
  app.use(require('./utils/publicRegistration'));

  // ===== Template Routes

  app.use(require('./utils/templateRoutes'));

  return server;
};
