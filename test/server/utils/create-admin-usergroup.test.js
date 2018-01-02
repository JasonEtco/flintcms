const Flint = require('../../../index.js');
const mongoose = require('mongoose');

describe('createAdminUserGroup', () => {
  let UserGroup;
  let createAdminUserGroup;

  beforeAll(async function () {
    const flintServer = new Flint({ templatePath: 'test/fixtures/templates/empty', listen: false });
    await flintServer.startServer();

    UserGroup = mongoose.model('UserGroup');

    // eslint-disable-next-line global-require
    createAdminUserGroup = require('../../../server/utils/create-admin-usergroup');

    return UserGroup.remove();
  });

  it('creates a new admin user group', async () => {
    const AdminUserGroup = await createAdminUserGroup();
    expect(typeof AdminUserGroup).toBe('object');
  });

  it('returns false if an admin user group already exists', async () => {
    const AdminUserGroup = await createAdminUserGroup();
    return expect(AdminUserGroup).toBe(false);
  });

  afterAll((done) => {
    mongoose.disconnect(done);
  });
});
