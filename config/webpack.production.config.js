const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const ChunkManifestPlugin = require('chunk-manifest-webpack-plugin');
const WebpackChunkHash = require('webpack-chunk-hash');

const autoprefixer = require('autoprefixer');
const { browsers, resolve, vendor } = require('./constants');

module.exports = {
  entry: {
    main: [
      'babel-polyfill',
      path.resolve(__dirname, '..', 'app', 'main.js'),
    ],
    vendor,
  },
  output: {
    path: path.join(__dirname, '..', 'admin'),
    filename: '[name]-[chunkhash].min.js',
    chunkFilename: '[name]-[chunkhash].min.js',
    publicPath: '/admin',
  },
  resolve,
  plugins: [
    new HtmlWebpackPlugin({
      template: path.join(__dirname, '..', 'app', 'index.tpl.html'),
      inject: 'body',
      filename: 'index.html',
    }),
    new BundleAnalyzerPlugin({
      analyzerMode: 'static',
      openAnalyzer: false,
    }),
    // new BabiliPlugin(),
    new webpack.optimize.UglifyJsPlugin(),
    new ExtractTextPlugin('[name]-[hash].min.css'),
    new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
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
    new webpack.optimize.CommonsChunkPlugin({
      name: ['vendor', 'manifest'], // vendor libs + extracted manifest
      minChunks: Infinity,
    }),
    new webpack.HashedModuleIdsPlugin(),
    new WebpackChunkHash(),
    new ChunkManifestPlugin({
      filename: 'chunk-manifest.json',
      manifestVariable: 'webpackManifest',
    }),
  ],
  module: {
    rules: [{
      test: /\.jsx?$/,
      exclude: /node_modules/,
      use: {
        loader: 'babel-loader',
        options: {
          presets: [
            ['env', {
              targets: { browsers },
              debug: false,
              loose: true,
              modules: false,
              useBuiltIns: true,
            }],
            'react',
          ],
          plugins: [
            [
              'transform-object-rest-spread',
              { useBuiltIns: true },
            ],
            'transform-runtime',
            'transform-class-properties',
          ],
        },
      },
    }, {
      test: /\.scss$/,
      use: ExtractTextPlugin.extract({
        fallback: 'style-loader',
        use: ['css-loader', {
          loader: 'postcss-loader',
          options: {
            sourceMap: true,
            plugins: () => [autoprefixer(browsers)],
          },
        }, {
          loader: 'sass-loader',
          options: {
            sourceMap: true,
            data: '@import "tools";',
            includePaths: [
              path.resolve(__dirname, '../app/scss/tools'),
            ],
          },
        }],
      }),
    }, {
      test: /\.(jpe?g|png|gif|svg)$/i,
      use: [
        'url-loader?limit=10000',
        'img-loader',
      ],
    }],
  },
};
