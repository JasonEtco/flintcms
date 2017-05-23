/* eslint no-console: 0 */

require('dotenv').config();
const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

mongoose.connect(process.env.DB_HOST, {
  user: process.env.DB_USER,
  pass: process.env.DB_PASS,
});

mongoose.connection.on('error', console.error.bind(console, 'Connection error:'));

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
