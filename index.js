/* eslint no-console: 0 */

const express = require('express');
const path = require('path');
const compression = require('compression');
const webpack = require('webpack');
const webpackMiddleware = require('webpack-dev-middleware');
const webpackHotMiddleware = require('webpack-hot-middleware');

const config = require('./config/webpack.config');

const app = express();

const http = require('http').Server(app);
const io = require('socket.io')(http);

io.on('connection', (socket) => {
  console.log('User connected!', socket.id);
});

app.use(compression());

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

  app.get('/', (req, res) => {
    res.write(middleware.fileSystem.readFileSync(path.join(__dirname, '../dashboard/index.html')));
    res.end();
  });
} else {
  app.use(express.static(__dirname));

  app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'dashboard/index.html'));
  });
}

http.listen(port, () => console.log(`Running at http://localhost:${port}`));
