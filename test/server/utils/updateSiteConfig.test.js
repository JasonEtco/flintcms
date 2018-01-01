const Flint = require('../../../index.js');
const populateDB = require('../../populatedb');
const mongoose = require('mongoose');

describe('updateSiteConfig', () => {
  beforeAll(async function () {
    const flintServer = new Flint({ listen: false });
    await flintServer.startServer();
    return populateDB();
  });

  it('updates the site config in the db', async () => {
    // eslint-disable-next-line global-require
    const updateSiteConfig = require('../../../server/utils/updateSiteConfig');
    const updatedSite = await updateSiteConfig();
    expect(typeof updatedSite).toBe('object');
  });

  it('adds a new site config to the db', async () => {
    const Site = mongoose.model('Site');

    await Site.remove();
    // eslint-disable-next-line global-require
    const updateSiteConfig = require('../../../server/utils/updateSiteConfig');
    const updatedSite = await updateSiteConfig();
    expect(typeof updatedSite).toBe('object');
  });

  afterAll((done) => {
    mongoose.disconnect(done);
  });
});
