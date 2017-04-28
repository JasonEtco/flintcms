const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const SiteSchema = new Schema({
  defaultUserGroup: {
    type: String,
    default: 'admin',
  },
  siteName: {
    type: String,
    default: 'Flint Site Name',
  },
  siteUrl: {
    type: String,
    default: 'https://flintcms.io',
  },
});

module.exports = mongoose.model('Site', SiteSchema, 'site');
