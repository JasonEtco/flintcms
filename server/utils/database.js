/* eslint no-console: 0 */

const mongoose = require('mongoose');
const chalk = require('chalk');
const log = require('debug')('flint');
const registerPlugins = require('./registerPlugins');

const UserGroupSchema = require('../models/UserGroupSchema');
const UserSchema = require('../models/UserSchema');
const SectionSchema = require('../models/SectionSchema');
const EntrySchema = require('../models/EntrySchema');
const FieldSchema = require('../models/FieldSchema');
const AssetSchema = require('../models/AssetSchema');
const PageSchema = require('../models/PageSchema');
const SiteSchema = require('../models/SiteSchema');
const PluginSchema = require('../models/PluginSchema');
const createAdminUserGroup = require('./create-admin-usergroup');
const updateSiteConfig = require('./updateSiteConfig');


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
    mongoose.connection.on('open', async () => {
      mongoose.model('Plugin', PluginSchema, 'plugins');
      await registerPlugins();

      mongoose.model('UserGroup', UserGroupSchema, 'usergroups');
      await createAdminUserGroup();

      mongoose.model('User', UserSchema, 'users');
      mongoose.model('Section', SectionSchema, 'sections');
      mongoose.model('Entry', EntrySchema, 'entries');
      mongoose.model('Field', FieldSchema, 'fields');
      mongoose.model('Asset', AssetSchema, 'assets');
      mongoose.model('Page', PageSchema, 'pages');

      mongoose.model('Site', SiteSchema, 'site');
      await updateSiteConfig();

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
