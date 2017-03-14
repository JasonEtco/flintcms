const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const autoprefixer = require('autoprefixer');
const { browsers } = require('./browser');

module.exports = {
  entry: [
    'whatwg-fetch',
    path.resolve(__dirname, '..', 'app', 'main.js'),
  ],
  output: {
    path: path.join(__dirname, '..', 'admin'),
    filename: '[name]-[hash].min.js',
    publicPath: '/admin',
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.join(__dirname, '..', 'app', 'index.tpl.html'),
      inject: 'body',
      filename: 'index.html',
    }),
    new ExtractTextPlugin('[name]-[hash].min.css'),
    new webpack.optimize.UglifyJsPlugin({
      compressor: {
        screw_ie8: true,
      },
    }),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
    }),
    new CopyWebpackPlugin([
      {
        context: path.join(__dirname, '..', 'app'),
        from: 'assets',
        to: 'assets',
        ignore: ['fonts/**/*'],
      },
      {
        context: path.join(__dirname, '..', 'app'),
        from: 'manifest.json',
        to: '',
      },
    ]),
  ],
  module: {
    loaders: [{
      test: /\.jsx?$/,
      exclude: /node_modules/,
      use: {
        loader: 'babel-loader',
        options: {
          presets: [
            'react',
            'es2015',
            'stage-0',
            'react-hmre',
          ],
          plugins: ['transform-runtime'],
        },
      },
    }, {
      test: /\.scss$/,
      use: ExtractTextPlugin.extract({
        fallback: 'style-loader',
        use: ['css-loader', {
          loader: 'sass-loader',
          options: {
            sourceMap: true,
            data: '@import "tools";',
            includePaths: [
              path.resolve(__dirname, '../app/scss/tools'),
            ],
            postcss: [
              autoprefixer({ browsers }),
            ],
          },
        }],
      }),
    }, {
      test: /\.(jpe?g|png|gif|svg)$/i,
      use: [
        {
          loader: 'file-loader',
          options: {
            hash: 'sha512',
            digest: 'hex',
            name: '[hash].[ext]',
          },
        },
        {
          loader: 'image-webpack-loader',
          options: {
            bypassOnDebug: true,
          },
        },
      ],
    }, {
      test: /\.(eot|svg|ttf|woff?)$/,
      use: {
        loader: 'file-loader',
        options: {
          name: 'assets/fonts/[name].[ext]',
        },
      },
    }],
  },
};
