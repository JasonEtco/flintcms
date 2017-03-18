const mongoose = require('mongoose');
const bcrypt = require('bcrypt-nodejs');

const UserGroup = mongoose.model('UserGroup');

const Schema = mongoose.Schema;

const UserSchema = new Schema({
  name: {
    first: {
      type: String,
    },
    last: {
      type: String,
    },
  },
  username: {
    type: String,
    required: true,
    unique: true,
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
  usergroup: {
    type: Schema.Types.ObjectId,
    ref: 'UserGroup',
    required: true,
  },
  image: {
    type: String,
    default: '/assets/default_user.png',
  },
  dateCreated: {
    type: Date,
    default: Date.now,
  },
  entries: [{
    type: Schema.Types.ObjectId,
    ref: 'Entry',
  }],
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
  const usergroup = await UserGroup.findById(this.usergroup);
  if (!usergroup) throw new Error('The User Group could not be found');

  return usergroup.permissions;
};

module.exports = mongoose.model('User', UserSchema, 'users');
