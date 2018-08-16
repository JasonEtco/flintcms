const mongoose = require('mongoose')
const { Schema } = mongoose

const Entry = new Schema({
  title: {
    type: String,
    required: true
  },
  slug: {
    type: String,
    required: true,
    unique: true
  },
  dateCreated: {
    type: Date,
    default: Date.now
  }
})

Entry.name = 'Entry'

module.exports = Entry
