/* eslint no-console: 0 */

const mongoose = require('mongoose');
const chalk = require('chalk');
const log = require('debug')('flint');

mongoose.Promise = global.Promise;

const mongoUri = `mongodb://${process.env.DB_HOST}`;
const mongoOptions = {
  user: process.env.DB_USER,
  pass: process.env.DB_PASS,
  useMongoClient: true,
};

module.exports = function connectToDatabase() {
  mongoose.connect(mongoUri, mongoOptions);
  return new Promise((resolve, reject) => {
    mongoose.connection.on('open', () => {
      /* eslint-disable global-require */
      require('../models/PluginModel');
      require('./registerPlugins')();

      require('../models/UserGroupModel');
      require('./createAdminUserGroup')();

      require('../models/UserModel');
      require('../models/SectionModel');
      require('../models/EntryModel');
      require('../models/FieldModel');
      require('../models/AssetModel');
      require('../models/PageModel');

      require('../models/SiteModel');
      require('./updateSiteConfig')();
      /* eslint-enable global-require */

      resolve(`${chalk.green('[Mongoose]')} connection has been successfully established.`);
    });
    mongoose.connection.on('error', e =>
      reject(`${chalk.red('[Mongoose]')} Connection error: ${e}`));
  });
};

// Close the Mongoose connected on Ctrl+C
/* istanbul ignore next */
process.on('SIGINT', () => {
  mongoose.connection.close(() => {
    log('Mongoose default connection disconnected');
    process.exit(0);
  });
});
