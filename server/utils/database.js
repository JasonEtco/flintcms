/* eslint no-console: 0 */

const mongoose = require('mongoose');
const chalk = require('chalk');

mongoose.Promise = global.Promise;

const mongoUri = process.env.DB_HOST;
const mongoCredentials = {
  user: process.env.DB_USER,
  pass: process.env.DB_PASS,
};

module.exports = function connectToDatabase() {
  mongoose.connect(mongoUri, mongoCredentials);
  return new Promise((resolve, reject) => {
    mongoose.connection.on('open', () => {
      require('../models/PluginModel');
      require('./registerPlugins')();

      require('../models/UserGroupModel');
      require('./createAdminUserGroup')();

      require('../models/UserModel');
      require('../models/SectionModel');
      require('../models/EntryModel');
      require('../models/FieldModel');
      require('../models/AssetModel');

      require('../models/SiteModel');
      require('./updateSiteConfig')();

      resolve(`${chalk.green('[Mongoose]')} connection has been successfully established.`);
    });
    mongoose.connection.on('error', (e) =>
      reject(`${chalk.red('[Mongoose]')} Connection error: ${e}`));
  })
}

// Close the Mongoose connected on Ctrl+C
process.on('SIGINT', () => {
  mongoose.connection.close(() => {
    console.log('Mongoose default connection disconnected');
    process.exit(0);
  });
});
