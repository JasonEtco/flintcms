const mongoose = require('mongoose');

const User = mongoose.model('User');

module.exports = async (_id) => {
  const user = await User.findById(_id).exec();
  const perms = await user.getPermissions();

  if (!perms) throw new Error('User permissions could not be found.');
  return perms;
};
