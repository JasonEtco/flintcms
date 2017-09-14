const Flint = require('../../../../index.js');
const request = require('supertest');
const mongoose = require('mongoose');
const expect = require('chai').expect;

describe('logs app', function () {
  this.timeout(4000);
  let server;

  before('Creates a server', async function () {
    const flintServer = new Flint({ logsPath: 'test/fixtures/logs', listen: false });
    server = await flintServer.startServer();
    return server;
  });

  it('returns a 200 response for /admin/api/logs', function (done) {
    request(server).get('/admin/api/logs').expect(200, done);
  });

  it('returns the correct logs as an array', async function () {
    const res = await request(server).get('/admin/api/logs');
    const { flint, http } = res.body;
    expect(flint).to.be.an('array');
    expect(http).to.be.an('array');

    expect(flint).to.deep.equal(['This', 'is', 'a', 'log']);
  });

  after('Closes the server', function (done) {
    mongoose.disconnect(done);
  });
});
