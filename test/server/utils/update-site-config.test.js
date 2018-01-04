const Flint = require('../../../index.js');
const populateDB = require('../../populatedb');
const mongoose = require('mongoose');

describe('updateSiteConfig', () => {
  beforeAll(async () => {
    const flintServer = new Flint({ listen: false });
    await flintServer.startServer();
    await populateDB();
  });

  it('updates the site config in the db', async () => {
    // eslint-disable-next-line global-require
    const updateSiteConfig = require('../../../server/utils/update-site-config');
    const updatedSite = await updateSiteConfig();
    expect(typeof updatedSite).toBe('object');
  });

  it('adds a new site config to the db', async () => {
    const Site = mongoose.model('Site');

    await Site.remove();
    // eslint-disable-next-line global-require
    const updateSiteConfig = require('../../../server/utils/update-site-config');
    const updatedSite = await updateSiteConfig();
    expect(typeof updatedSite).toBe('object');
  });

  afterAll(() => mongoose.disconnect());
});
