/* eslint no-console: 0 */

const express = require('express');
const session = require('cookie-session');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const path = require('path');
const compression = require('compression');
const webpack = require('webpack');
const webpackMiddleware = require('webpack-dev-middleware');
const webpackHotMiddleware = require('webpack-hot-middleware');
const passport = require('passport');

const config = require('../config/webpack.config');
require('./utils/database');
require('./utils/passport')(passport);

require('./utils/registerHelpers');
require('./utils/registerPartials');
const compile = require('./utils/compile');

const getEntryData = require('./utils/getEntryData');
const getTemplateFromEntry = require('./utils/getTemplateFromEntry');

const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);

io.on('connection', (socket) => {
  console.log('User connected!', socket.id);
});

// app.use(morgan('combined'));
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(session({ secret: process.env.SESSION_SECRET }));

app.use(passport.initialize());
app.use(passport.session());

app.use(compression());

// Application Routes
app.use(require('./routes/auth'));
app.use(require('./routes/user'));
app.use(require('./routes/templates'));
require('./routes/entries')(app, io);
require('./routes/section')(app, io);
require('./routes/fields')(app, io);

const routes = {
  index: path.resolve(__dirname, '..', 'templates', 'index.hbs'),
};

app.get('/', (req, res) => compile('index', { name: 'Jason' }).then(r => res.send(r)));

const isDeveloping = process.env.NODE_ENV !== 'production';
const port = isDeveloping ? 4000 : process.env.PORT;

if (isDeveloping) {
  console.log('Development mode!');
  const compiler = webpack(config);
  const middleware = webpackMiddleware(compiler, {
    publicPath: config.output.publicPath,
    stats: {
      colors: true,
      hash: false,
      timings: true,
      chunks: false,
      chunkModules: false,
      modules: false,
    },
  });

  app.use(middleware);
  app.use(webpackHotMiddleware(compiler));

  app.get('/admin*', (req, res) => {
    res.write(middleware.fileSystem.readFileSync(path.join(__dirname, '..', 'flint', 'index.html')));
    res.end();
  });
} else {
  app.use(express.static(path.join(__dirname, '..')));

  app.get('/admin*', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'flint', 'index.html'));
  });
}

app.get('/all', (req, res) => {
  getEntryData()
    .then(data => compile(routes.index, { entries: data }))
    .then(r => res.send(r));
});

app.get('/:slug', (req, res) => {
  getEntryData(req.params.slug)
    .then(data => getTemplateFromEntry(data)
      .then(({ template }) => compile(template, data))
      .catch(err => new Error(err)))
    .then(r => res.send(r))
    .catch(err => new Error(err));
});

http.listen(port, () => console.log(`Running at http://localhost:${port}`));
