/* eslint no-console: 0 */

const express = require('express');
const session = require('cookie-session');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
// const morgan = require('morgan');
const path = require('path');
const compression = require('compression');
const passport = require('passport');

require('./utils/database');
require('./utils/passport')(passport);

require('./utils/registerHelpers');
require('./utils/registerPartials');
const compile = require('./utils/compile');

const getEntryData = require('./utils/getEntryData');
const getTemplateFromEntry = require('./utils/getTemplateFromEntry');

const app = module.exports = express();
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

const routes = {
  index: path.resolve(__dirname, '..', 'templates', 'index.hbs'),
};

const isDeveloping = process.env.NODE_ENV !== 'production';
const port = isDeveloping ? 4000 : process.env.PORT;

app.use('/admin', require('./apps/admin'));
app.use('/graphql', require('./apps/graphql'));

app.use('/assets', express.static(path.join(__dirname, '..', 'assets')));

app.get('/', (req, res) => compile('index', { name: 'Jason' }).then(r => res.send(r)));

app.get('/all', async (req, res) => {
  const EntryData = await getEntryData(req.params.slug);
  const compiled = await compile(routes.index, { entries: EntryData.toObject() });
  res.send(compiled);
});

app.get('/:slug', async (req, res) => {
  const EntryData = await getEntryData(req.params.slug);
  const data = await getTemplateFromEntry(EntryData);
  const compiled = await compile(data.template, data.toObject());
  res.send(compiled);
});

http.listen(port, () => console.log(`[HTTP Server] Running at http://localhost:${port}`));

module.exports = app;
