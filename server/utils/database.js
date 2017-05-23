/* eslint no-console: 0 */

require('dotenv').config();
const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

const mongoUri = process.env.DB_HOST;
const mongoCredentials = {
  user: process.env.DB_USER,
  pass: process.env.DB_PASS,
};

mongoose.connect(mongoUri, mongoCredentials);

mongoose.connection.on('error', (e) => {
  console.error.bind(console, 'Connection error:');
  if (e.message.code === 'ETIMEDOUT') {
    mongoose.connect(mongoUri, mongoCredentials);
  }
});

mongoose.connection.once('open', console.log('MongoDB connection established.'));

// Close the Mongoose connected on Ctrl+C
process.on('SIGINT', () => {
  mongoose.connection.close(() => {
    console.log('Mongoose default connection disconnected');
    process.exit(0);
  });
});

const TestPlugin = require('../../plugins/TestPlugin');

mongoose.plugin(schema => new TestPlugin(schema));

require('../models/UserGroupModel');
require('../models/UserModel');
require('../models/SectionModel');
require('../models/EntryModel');
require('../models/FieldModel');
require('../models/AssetModel');
require('../models/SiteModel');
