const mongoose = require('mongoose')

const Schema = mongoose.Schema

const PluginSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  title: {
    type: String,
    required: true,
    unique: true
  },
  uid: {
    type: String,
    required: true,
    unique: true
  },
  icon: {
    path: {
      type: String,
      required: true,
      default: 'icon.png'
    },
    buffer: {
      type: Buffer,
      required: true
    }
  },
  dateInstalled: {
    type: Date,
    default: Date.now
  },
  version: {
    type: String,
    required: true
  }
}, { strict: false })

PluginSchema.name = 'Plugin'

module.exports = PluginSchema
