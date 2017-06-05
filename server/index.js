/* eslint no-console: 0 */

const express = require('express');
const chalk = require('chalk');
const session = require('cookie-session');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
// const morgan = require('morgan');
const path = require('path');
const compression = require('compression');
const passport = require('passport');

require('./utils/database');
require('./utils/passport')(passport);

const compile = require('./utils/compile');
const fourOhFourHandler = require('./utils/fourOhFourHandler');

require('./utils/compileSass')();
const getEntryData = require('./utils/getEntryData');

const app = express();
exports.app = app;

const http = require('http').Server(app);
const io = require('socket.io')(http);

app.set('io', io);

// app.use(morgan('combined'));
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

app.get('/', async (req, res) => {
  const compiled = await compile('index');
  res.send(compiled);
});

// app.get('/:section/:slug', async (req, res) => {
//   const EntryData = await getEntryData(req.params);

//   if (!EntryData) {
//     fourOhFourHandler(res);
//     return;
//   }

//   const compiled = await compile(EntryData.template, EntryData);
//   res.send(compiled);
// });

function startServer(port) {
  http.listen(port, () => console.log(`\n${chalk.green('[HTTP Server]')} Flint server running at http://localhost:${port}\n`));
}

exports.startServer = startServer;
