/* eslint no-console: 0 */

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

require('./utils/passport')(passport);

const app = express();
exports.app = app;

const http = require('http').Server(app);
const io = require('socket.io')(http);

app.set('io', io);

const accessLogStream = fs.createWriteStream(path.join(global.FLINT.logsPath, 'http-requests.log'), { flags: 'a' });
app.use(morgan('combined', { stream: accessLogStream }));

app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(session({ secret: process.env.SESSION_SECRET }));

app.use(passport.initialize());
app.use(passport.session());

app.use(compression());

app.use('/public', express.static(global.FLINT.publicPath));
app.use('/manifest.json', express.static(path.join(__dirname, '..', 'manifest.json')));
app.use('/admin', require('./apps/admin'));
app.use('/graphql', require('./apps/graphql'));
app.use(require('./utils/publicRegistration'));

// ===== Template Routes

app.use(require('./utils/templateRoutes'));

/**
 * Starts the Flint server.
 * @param {Number} port - Port to listen on for the main server
 */
function startServer(port) {
  http.listen(port, () => console.log(`\n${chalk.green('[HTTP Server]')} Flint server running at http://localhost:${port}\n`));
}

exports.startServer = startServer;
