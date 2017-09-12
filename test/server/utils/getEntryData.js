/* eslint-disable func-names, prefer-arrow-callback */

const Flint = require('../../../index.js');
const expect = require('chai').expect;
const populateDB = require('../../populatedb');
const mongoose = require('mongoose');
const mocks = require('../../mocks');

describe('getEntryData', function () {
  before('Creates a server and populates the db', async function () {
    const flintServer = new Flint({ listen: false, templatePath: 'test/fixtures' });
    await flintServer.startServer();
    return populateDB();
  });

  it('returns an entry\'s data', async function () {
    // eslint-disable-next-line global-require
    const getEntryData = require('../../../server/utils/getEntryData');
    const section = mocks.sections.find(s => mocks.entries[3].section === s._id);
    const entry = await getEntryData({ slug: mocks.entries[3].slug, section: section.slug });
    const author = mocks.users.find(u => mocks.entries[3].author === u._id);

    expect(entry).to.deep.equal({
      _id: mocks.entries[3]._id,
      title: mocks.entries[3].title,
      fields: mocks.entries[3].fields,
      status: mocks.entries[3].status,
      slug: mocks.entries[3].slug,
      dateCreated: mocks.entries[3].dateCreated,
      section: mocks.entries[3].section,
      template: section.template,
      author: {
        email: author.email,
        username: author.username,
        name: author.name,
      },
    });
  });

  after((done) => {
    mongoose.disconnect();
    done();
  });
});
