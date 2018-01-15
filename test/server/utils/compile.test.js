const Flint = require('../../../index.js');
const request = require('supertest');
const populateDB = require('../../populatedb');
const mongoose = require('mongoose');
const mocks = require('../../mocks');

describe('Compile templates', () => {
  let server;

  beforeAll(async () => {
    const flintServer = new Flint({ templatePath: 'test/fixtures/templates', listen: false });
    server = await flintServer.startServer();
    await populateDB();
  });

  it('returns the index.njk template for the homepage', async () => {
    const res = await request(server).get('/');
    expect(res.text).not.toBe('no-template');
    expect(res.text).toMatchSnapshot();
  });

  it('returns 404 when a page does not exist', async () => {
    const res = await request(server).get('/pizza');
    expect(res.status).toBe(404);
    expect(res.text).toMatchSnapshot();
  });

  it('returns a page with variables', async () => {
    const res = await request(server).get('/page-with-vars');
    console.log(res.text)
    expect(res.status).toBe(200);
    expect(res.text).toMatchSnapshot();
  });

  it('returns an entry in a section', async () => {
    const url = `/${mocks.sections[0].slug}/${mocks.entries[3].slug}`;
    const res = await request(server).get(url);
    expect(res.status).toBe(200);
    expect(res.text).toMatchSnapshot();
  });

  afterAll((done) => {
    mongoose.disconnect(done);
  });
});

describe('Custom filters', () => {
  let server;

  beforeAll(async () => {
    const flintServer = new Flint({ templatePath: 'test/fixtures/templates', listen: false });
    server = await flintServer.startServer();
  });

  describe('field filter', () => {
    it('returns the correct value', async () => {
      const url = `/${mocks.sections[2].slug}/${mocks.entries[4].slug}`;
      const res = await request(server).get(url);

      expect(res.status).toBe(200);
      expect(res.text).toMatchSnapshot();
    });
  });

  afterAll((done) => {
    mongoose.disconnect(done);
  });
});
