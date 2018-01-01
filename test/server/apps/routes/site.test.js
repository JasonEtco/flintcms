const Flint = require('../../../../index.js');
const request = require('supertest');
const mongoose = require('mongoose');

describe('site endpoint', () => {
  this.timeout(4000);
  let server;

  beforeAll(async function () {
    const flintServer = new Flint({ listen: false });
    server = await flintServer.startServer();
    return server;
  });

  it('returns a 200 response for /admin/api/site', (done) => {
    request(server).get('/admin/api/site').expect(200, done);
  });

  it('returns a 200 response for /admin/api/hasUpdate', (done) => {
    request(server).get('/admin/api/hasUpdate').expect(200, done);
  });

  it('GET /admin/api/hasUpdate returns an object', async () => {
    const res = await request(server).get('/admin/api/hasUpdate');
    expect(typeof res.body.hasUpdate).toBe('boolean');
  });

  afterAll(function (done) {
    mongoose.disconnect(done);
  });
});
