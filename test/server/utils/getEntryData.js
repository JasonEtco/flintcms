/* eslint-disable func-names, prefer-arrow-callback */

const Flint = require('../../../index.js');
const expect = require('expect');
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

    expect(entry._id).toEqual(mocks.entries[3]._id);
    expect(entry.title).toEqual(mocks.entries[3].title);
    expect(entry.fields).toEqual(mocks.entries[3].fields);
    expect(entry.status).toEqual(mocks.entries[3].status);
    expect(entry.slug).toEqual(mocks.entries[3].slug);
    expect(entry.dateCreated).toEqual(mocks.entries[3].dateCreated);
    expect(entry.section).toEqual(mocks.entries[3].section);
    expect(entry.template).toEqual(section.template);
    expect(entry.author.email).toEqual(author.email);
    expect(entry.author.name).toBe(author.name);
    expect(entry.author.username).toEqual(author.username);
  });

  after((done) => {
    mongoose.disconnect();
    done();
  });
});
