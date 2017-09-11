const Flint = require('../../../index.js');
const expect = require('chai').expect;
const populateDB = require('../../populatedb');
const mongoose = require('mongoose');

describe('updateSiteConfig', function () {
  before('Creates a server and populates the db', async function () {
    const flintServer = new Flint({ listen: false });
    await flintServer.startServer();
    return populateDB();
  });

  it('updates the site config in the db', async function () {
    // eslint-disable-next-line global-require
    const updateSiteConfig = require('../../../server/utils/updateSiteConfig');
    const updatedSite = await updateSiteConfig();
    expect(updatedSite).to.be.an('object');
  });

  after((done) => {
    mongoose.disconnect(done);
  });
});
