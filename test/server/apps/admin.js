const Flint = require('../../../index.js');
const request = require('supertest');
const mongoose = require('mongoose');

describe('admin', function () {
  this.timeout(4000);
  let server;

  before('Creates a server', async function () {
    const flintServer = new Flint({ listen: false });
    server = await flintServer.startServer();
    return server;
  });

  describe('GET /admin/*', function () {
    it('returns a 200 response for /admin/login', function (done) {
      request(server).get('/admin/login')
        .expect(200)
        .expect(res => res.text.startsWith('<!DOCTYPE html>'))
        .end(done);
    });

    it('returns a 200 response for any route', function (done) {
      request(server).get('/admin/asdfsdfsadfsadf')
        .expect(200)
        .expect(res => res.text.startsWith('<!DOCTYPE html>'))
        .end(done);
    });
  });

  after('Closes the server', function (done) {
    mongoose.disconnect(done);
  });
});
