const Flint = require('../../../index.js');
const expect = require('chai').expect;
const mongoose = require('mongoose');

describe('Compiler 404', function () {
  let UserGroup;
  let createAdminUserGroup;

  before('Creates a server and populates the db', async function () {
    const flintServer = new Flint({ templatePath: 'test/fixtures/templates/empty', listen: false });
    await flintServer.startServer();

    UserGroup = mongoose.model('UserGroup');

    // eslint-disable-next-line global-require
    createAdminUserGroup = require('../../../server/utils/createAdminUserGroup');

    return UserGroup.remove();
  });

  it('creates a new admin user group', async function () {
    const AdminUserGroup = await createAdminUserGroup();
    expect(AdminUserGroup).to.be.an('object');
  });

  it('returns false if an admin user group already exists', async function () {
    const AdminUserGroup = await createAdminUserGroup();
    return expect(AdminUserGroup).to.be.false;
  });

  after((done) => {
    mongoose.disconnect(done);
  });
});
