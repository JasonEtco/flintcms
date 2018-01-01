const Flint = require('../index.js');
const request = require('supertest');
const mongoose = require('mongoose');

describe('server', () => {
  this.timeout(4000);
  let server;

  beforeAll(async function () {
    const flintServer = new Flint();
    server = await flintServer.startServer();
    return server;
  });

  describe('Monitoring', () => {
    it('is listening', () => {
      return expect(server.listening).toBe(true);
    });
  });

  describe('GET /ping', () => {
    it('returns a 200 response', done => {
      request(server).get('/ping').expect(200, 'PONG', done);
    });
  });

  describe('Plugin object', () => {
    it('returns the plugin object', () => {
      const FlintPlugin = new Flint.FlintPlugin();
      expect(typeof FlintPlugin).toBe('object');
    });
  });

  afterAll(function (done) {
    mongoose.disconnect();
    server.shutdown(done);
  });
});
