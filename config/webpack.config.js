const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
  devtool: 'eval-source-map',
  entry: [
    'webpack-hot-middleware/client?reload=true',
    'whatwg-fetch',
    path.join(__dirname, '..', 'src', 'main.js'),
  ],
  output: {
    path: path.join(__dirname, '..', 'dashboard'),
    filename: '[name].js',
    publicPath: '/',
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.join(__dirname, '..', 'src', 'index.tpl.html'),
      inject: 'body',
      filename: 'index.html',
    }),
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin(),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('development'),
    }),
    new CopyWebpackPlugin([
      {
        context: path.join(__dirname, '..', 'src'),
        from: 'assets',
        to: 'assets',
        ignore: ['fonts/**/*'],
      },
    ]),
  ],
  module: {
    loaders: [{
      test: /\.jsx?$/,
      exclude: /node_modules/,
      loader: 'babel',
      query: {
        presets: [
          'react',
          'es2015',
          'stage-0',
          'react-hmre',
        ],
        plugins: ['transform-runtime'],
      },
    }, {
      test: /\.scss$/,
      loaders: ['style', 'css', 'resolve-url', 'sass?sourceMap'],
    }, {
      test: /\.(jpe?g|png|gif|svg)$/i,
      loaders: [
        'file?hash=sha512&digest=hex&name=[hash].[ext]',
        'image-webpack?bypassOnDebug&optimizationLevel=7&interlaced=false',
      ],
    }, {
      test: /\.(eot|svg|ttf|woff?)$/,
      loader: 'file?name=assets/fonts/[name].[ext]',
    }],
  },
};
