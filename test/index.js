const Flint = require('../index.js');
const request = require('supertest');
const expect = require('chai').expect;
const mongoose = require('mongoose');

describe('server', function () {
  this.timeout(4000);
  let server;

  before('Creates a server', async function () {
    const flintServer = new Flint();
    server = await flintServer.startServer();
    return server;
  });

  describe('Monitoring', function () {
    it('is listening', function () {
      return expect(server.listening).to.be.true;
    });
  });

  describe('GET /ping', function () {
    it('returns a 200 response', function (done) {
      request(server).get('/ping').expect(200, 'PONG', done);
    });
  });

  describe('Plugin object', function () {
    it('returns the plugin object', function () {
      const FlintPlugin = new Flint.FlintPlugin();
      expect(FlintPlugin).to.be.an('object');
    });
  });

  after('Closes the server', function (done) {
    mongoose.disconnect();
    server.shutdown(done);
  });
});
