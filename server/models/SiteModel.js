const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const SiteSchema = new Schema({
  defaultUserGroup: {
    type: String,
    default: 'admin',
  },
  siteName: String,
  siteUrl: String,
});

module.exports = mongoose.model('Entry', SiteSchema, 'entries');
