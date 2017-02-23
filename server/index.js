/* eslint no-console: 0 */

const express = require('express');
const session = require('cookie-session');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
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

app.get('/', (req, res) => compile('index', { name: 'Jason' }).then(r => res.send(r)));

app.get('/all', (req, res) => {
  getEntryData()
    .then(data => compile(routes.index, { entries: data.toObject() }))
    .then(r => res.send(r));
});

app.get('/:slug', (req, res) => {
  getEntryData(req.params.slug)
    .then(data => getTemplateFromEntry(data)
      .then(({ template }) => compile(template, data.toObject()))
      .catch(err => new Error(err)))
    .then(r => res.send(r))
    .catch(err => new Error(err));
});

http.listen(port, () => console.log(`[HTTP Server] Running at http://localhost:${port}`));

module.exports = app;
