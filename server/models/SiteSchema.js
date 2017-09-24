const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const SiteSchema = new Schema({
  defaultUserGroup: {
    type: Schema.Types.ObjectId,
    ref: 'UserGroup',
  },
  siteName: {
    type: String,
    default: 'Flint Site Name',
  },
  siteUrl: {
    type: String,
    default: 'https://flintcms.io',
  },
  siteLogo: {
    type: Schema.Types.Mixed,
  },
  style: String,
  allowPublicRegistration: {
    type: Boolean,
    default: false,
  },
  templatePath: String,
  scssPath: String,
  publicPath: String,
  configPath: String,
  pluginPath: String,
  scssEntryPoint: {
    type: String,
    default: 'main.scss',
  },
  enableCacheBusting: {
    type: Boolean,
    default: false,
  },
  cssHash: String,
}, { strict: false });

SiteSchema.name = 'Site';

module.exports = SiteSchema;
