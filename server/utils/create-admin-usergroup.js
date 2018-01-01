const mongoose = require('mongoose');
const reducePermissionsToObject = require('./reducePermissionsToObject');

/**
 * Creates an admin usergroup in the database
 */
async function createAdminUserGroup() {
  const UserGroup = mongoose.model('UserGroup');
  if (await UserGroup.findOne({ slug: 'admin' })) return false;

  const perms = reducePermissionsToObject((p, c) => Object.assign({}, p, { [c.name]: true }), {});

  const adminUserGroup = new UserGroup({
    title: 'Admin',
    slug: 'admin',
    permissions: perms,
  });

  const savedAdminUserGroup = await adminUserGroup.save();

  /* istanbul ignore if */
  if (!savedAdminUserGroup) throw new Error('Could not create admin usergroup');

  return savedAdminUserGroup;
}

module.exports = createAdminUserGroup;
