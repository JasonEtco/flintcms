/* eslint-disable func-names, prefer-arrow-callback */

const Flint = require('../index.js');
const request = require('supertest');
const expect = require('expect');
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
      expect(server.listening).toBeTruthy();
    });
  });

  describe('GET /ping', function () {
    it('returns a 200 response', function (done) {
      request(server).get('/ping').expect(200, 'PONG', done);
    });
  });

  after('Closes the server', function (done) {
    mongoose.disconnect();
    server.shutdown(done);
  });
});
