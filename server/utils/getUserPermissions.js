const mongoose = require('mongoose');

const User = mongoose.model('User');

/**
 * Gets an object of the users's permissions based on their User Group
 * @param {String} _id - Mongo ID of the User
 * @returns {Object} Object of the various booleans of permissions
 */
async function getUserPermissions(_id) {
  const user = await User.findById(_id).exec();
  const perms = await user.getPermissions();

  if (!perms) throw new Error('User permissions could not be found.');
  return perms;
}

module.exports = getUserPermissions;
