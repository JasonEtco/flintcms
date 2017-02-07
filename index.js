/* eslint no-console: 0 */

const express = require('express');
const path = require('path');
const compression = require('compression');
const webpack = require('webpack');
const webpackMiddleware = require('webpack-dev-middleware');
const webpackHotMiddleware = require('webpack-hot-middleware');
const passport = require('passport');

const config = require('./config/webpack.config');
require('./utils/database');

const compile = require('./utils/compile');
require('./utils/registerPartials');

const getEntryData = require('./utils/getEntryData');

const app = express();

const http = require('http').Server(app);
const io = require('socket.io')(http);

io.on('connection', (socket) => {
  console.log('User connected!', socket.id);
});

app.use(compression());
app.use(express.session({ secret: process.env.SECRET }));
app.use(passport.initialize());
app.use(passport.session());

const isDeveloping = process.env.NODE_ENV !== 'production';
const port = isDeveloping ? 4000 : process.env.PORT;

const routes = {
  index: './templates/index.hbs',
};

app.get('/', (req, res) => compile(routes.index, { name: 'Jason' }).then(r => res.send(r)));
app.get('/:slug', (req, res) => {
  getEntryData(req.params.slug)
    .then(data => compile(routes.index, data))
    .then(r => res.send(r));
});

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

  app.get('/admin', (req, res) => {
    res.write(middleware.fileSystem.readFileSync(path.join(__dirname, 'dashboard', 'index.html')));
    res.end();
  });
} else {
  app.use(express.static(__dirname));

  app.get('/admin', (req, res) => {
    res.sendFile(path.join(__dirname, 'dashboard', 'index.html'));
  });
}

http.listen(port, () => console.log(`Running at http://localhost:${port}`));
