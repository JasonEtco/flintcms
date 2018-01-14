const mongoose = require('mongoose')
const reducePermissionsToObject = require('../utils/reduce-perms-to-object')
const h = require('../utils/helpers')

const Schema = mongoose.Schema

function reducePermissionsForMongoose (previous, { name, defaultValue }) {
  return Object.assign({}, previous, { [name]: {
    type: Boolean,
    default: defaultValue
  } })
}
// Format the master list of permissions to be easily consumable in a Mongoose Schema
const permissions = reducePermissionsToObject(reducePermissionsForMongoose)

const UserGroupSchema = new Schema({
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
  },
  permissions
})

UserGroupSchema.name = 'UserGroup'

// Can't use arrow function because of (this) binding
// eslint-disable-next-line func-names
UserGroupSchema.pre('validate', function (next) {
  this.slug = h.slugify(this.title)
  next()
})

module.exports = UserGroupSchema
