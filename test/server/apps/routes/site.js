const Flint = require('../../../../index.js');
const request = require('supertest');
const mongoose = require('mongoose');
const expect = require('chai').expect;

describe('site endpoint', function () {
  this.timeout(4000);
  let server;

  before('Creates a server', async function () {
    const flintServer = new Flint({ listen: false });
    server = await flintServer.startServer();
    return server;
  });

  it('returns a 200 response for /admin/api/site', function (done) {
    request(server).get('/admin/api/site').expect(200, done);
  });

  it('returns a 200 response for /admin/api/hasUpdate', function (done) {
    request(server).get('/admin/api/hasUpdate').expect(200, done);
  });

  it('GET /admin/api/hasUpdate returns an object', async function () {
    const res = await request(server).get('/admin/api/hasUpdate');
    expect(res.body.hasUpdate).to.be.a('boolean');
  });

  after('Closes the server', function (done) {
    mongoose.disconnect(done);
  });
});
