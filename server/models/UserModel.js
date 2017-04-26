const mongoose = require('mongoose');
const bcrypt = require('bcrypt-nodejs');
const permissions = require('../utils/permissions');

const UserGroup = mongoose.model('UserGroup');

const Schema = mongoose.Schema;

const UserSchema = new Schema({
  name: {
    first: String,
    last: String,
  },
  password: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  username: {
    type: String,
    lowercase: true,
    required: true,
    unique: true,
  },
  usergroup: {
    type: String,
    default: 'admin',
  },
  image: {
    type: String,
    default: 'default_user.png',
  },
  dateCreated: {
    type: Date,
    default: Date.now,
  },
  token: String,
});

// Generate hash
UserSchema.methods.generateHash = password => bcrypt.hashSync(password, bcrypt.genSaltSync());

// Validate hash
// Can't use arrow function because of (this) binding
// eslint-disable-next-line func-names
UserSchema.methods.validateHash = function (password) {
  return bcrypt.compareSync(password, this.password);
};

// eslint-disable-next-line func-names
UserSchema.methods.getPermissions = async function () {
  if (this.usergroup === 'admin') {
    const perms = Object.keys(permissions).reduce((prev, curr) => Object.assign({}, prev, {
      [curr]: permissions[curr].reduce((p, c) => Object.assign({}, p, { [c.name]: true }), {}),
    }), {});

    return perms;
  }

  const usergroup = await UserGroup.findById(this.usergroup);
  if (!usergroup) throw new Error('The User Group could not be found');

  return usergroup.permissions;
};

module.exports = mongoose.model('User', UserSchema, 'users');
