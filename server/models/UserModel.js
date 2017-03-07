const mongoose = require('mongoose');
const bcrypt = require('bcrypt-nodejs');

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
  // usergroup: {
  //   type: Schema.Types.ObjectId,
  //   ref: 'UserGroup',
  //   required: true,
  // },
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
UserSchema.methods.validateHash = function (password) { // eslint-disable-line func-names
  return bcrypt.compareSync(password, this.password);
};

module.exports = mongoose.model('User', UserSchema, 'users');
