const mongoose = require('mongoose');
const reducePermissionsToObject = require('./reducePermissionsToObject');

const UserGroup = mongoose.model('UserGroup');

/**
 * Creates an admin usergroup in the database
 */
async function createAdminUserGroup() {
  if (await UserGroup.findOne({ slug: 'admin' })) return;

  const perms = reducePermissionsToObject((p, c) => Object.assign({}, p, { [c.name]: true }), {});

  const adminUserGroup = new UserGroup({
    title: 'Admin',
    slug: 'admin',
    permissions: perms,
  });

  const savedAdminUserGroup = await adminUserGroup.save();
  if (!savedAdminUserGroup) throw new Error('Could not create admin usergroup');
}

module.exports = createAdminUserGroup;
