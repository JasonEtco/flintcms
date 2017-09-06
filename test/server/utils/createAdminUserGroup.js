/* eslint-disable func-names, prefer-arrow-callback */

const Flint = require('../../../index.js');
const expect = require('expect');
const mongoose = require('mongoose');
const wipeDatabase = require('../../wipeDatabase');

describe('Creates a new admin user group', function () {
  before('Creates a server', async function () {
    await wipeDatabase();
    const flintServer = new Flint({ listen: false, templatePath: 'test/fixtures' });
    return flintServer.startServer();
  });

  it('creates a new admin user group', async function () {
    const UserGroup = mongoose.model('UserGroup');
    const adminGroup = await UserGroup.findOne({ slug: 'admin' }).exec();
    expect(adminGroup).toExist();
  });

  after((done) => {
    mongoose.disconnect();
    done();
  });
});
