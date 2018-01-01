const Flint = require('../../../../index.js');
const request = require('supertest');
const mongoose = require('mongoose');

describe('logs app', () => {
  this.timeout(4000);
  let server;

  beforeAll(async function () {
    const flintServer = new Flint({ logsPath: 'test/fixtures/logs', listen: false });
    server = await flintServer.startServer();
    return server;
  });

  it('returns a 200 response for /admin/api/logs', (done) => {
    request(server).get('/admin/api/logs').expect(200, done);
  });

  it('returns the correct logs as an array', async () => {
    const res = await request(server).get('/admin/api/logs');
    const { flint, http } = res.body;
    expect(Array.isArray(flint)).toBe(true);
    expect(Array.isArray(http)).toBe(true);

    expect(flint).toEqual(['This', 'is', 'a', 'log']);
  });

  afterAll(function (done) {
    mongoose.disconnect(done);
  });
});
