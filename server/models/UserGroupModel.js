const mongoose = require('mongoose');
const perms = require('../utils/permissions');
const h = require('../utils/helpers');

const Schema = mongoose.Schema;

const permissions = Object.keys(perms).reduce((prev, curr) => Object.assign({}, prev, {
  [curr]: perms[curr].reduce((p, c) => Object.assign({}, p, { [c.name]: {
    type: Boolean,
    default: c.defaultValue,
  } }), {}),
}), {});

const UserGroupSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  slug: {
    type: String,
    required: true,
    unique: true,
  },
  dateCreated: {
    type: Date,
    default: Date.now,
  },
  permissions,
});

// Can't use arrow function because of (this) binding
// eslint-disable-next-line func-names
UserGroupSchema.pre('validate', function (next) {
  this.slug = h.slugify(this.title);
  next();
});

module.exports = mongoose.model('UserGroup', UserGroupSchema, 'usergroups');
