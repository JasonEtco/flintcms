/* eslint no-console: 0 */

const mongoose = require('mongoose')
const registerPlugins = require('./register-plugins')

const UserGroupSchema = require('../models/UserGroupSchema')
const UserSchema = require('../models/UserSchema')
const SectionSchema = require('../models/SectionSchema')
const EntrySchema = require('../models/EntrySchema')
const FieldSchema = require('../models/FieldSchema')
const AssetSchema = require('../models/AssetSchema')
const PageSchema = require('../models/PageSchema')
const SiteSchema = require('../models/SiteSchema')
const PluginSchema = require('../models/PluginSchema')
const createAdminUserGroup = require('./create-admin-usergroup')
const updateSiteConfig = require('./update-site-config')

module.exports = function connectToDatabase (log) {
  const config = {
    development: {
      database: 'flint-dev',
      host: '127.0.0.1'
    },
    test: {
      database: 'flint-test',
      host: '127.0.0.1'
    }
  }

  const env = process.env.NODE_ENV || 'development'
  mongoose.Promise = global.Promise

  let mongoUri
  if (env === 'production') {
    const { DB_URL, DB_USER, DB_PASS } = process.env
    mongoUri = `mongodb://${DB_USER}:${DB_PASS}@${DB_URL}`
  } else {
    const cfg = config[env]
    mongoUri = `mongodb://${cfg.host}/${cfg.database}`
  }

  const mongoOptions = { useMongoClient: true }

  mongoose.connect(mongoUri, mongoOptions)
  return new Promise((resolve, reject) => {
    mongoose.connection.on('open', async () => {
      mongoose.model('Plugin', PluginSchema, 'plugins')
      await registerPlugins()

      mongoose.model('UserGroup', UserGroupSchema, 'usergroups')
      await createAdminUserGroup()

      mongoose.model('User', UserSchema, 'users')
      mongoose.model('Section', SectionSchema, 'sections')
      mongoose.model('Entry', EntrySchema, 'entries')
      mongoose.model('Field', FieldSchema, 'fields')
      mongoose.model('Asset', AssetSchema, 'assets')
      mongoose.model('Page', PageSchema, 'pages')

      mongoose.model('Site', SiteSchema, 'site')
      await updateSiteConfig()

      resolve('[Mongoose] connection has been successfully established.')
    })
    mongoose.connection.on('error', e =>
      reject(new Error(`[Mongoose] Connection error: ${e}`)))
  })
}

// Close the Mongoose connected on Ctrl+C
/* istanbul ignore next */
process.on('SIGINT', () => {
  mongoose.connection.close(() => {
    console.log('Mongoose default connection disconnected')
    process.exit(0)
  })
})
