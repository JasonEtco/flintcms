const mongoose = require('mongoose');
const bcrypt = require('bcrypt-nodejs');

const Schema = mongoose.Schema;

const UserSchema = new Schema({
  name: {
    first: {
      type: String,
      required: true,
    },
    last: {
      type: String,
      required: true,
    },
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  usergroup: {
    type: Schema.Types.ObjectId,
    ref: 'UserGroup',
    required: true,
  },
  image: {
    type: String,
    default: 'assets/default_user.png',
  },
  dateCreated: {
    type: Date,
    required: true,
  },
  entries: [{
    type: Schema.Types.ObjectId,
    ref: 'Entry',
  }],
});

// Generate hash
UserSchema.methods.generateHash = password => bcrypt.hashSync(password, bcrypt.genSaltSync());

// Validate hash
UserSchema.methods.validateHash = password => bcrypt.compareSync(password, this.password);

module.exports = mongoose.model('User', UserSchema);
