const Flint = require('../index.js');
const request = require('supertest');
const mongoose = require('mongoose');

describe('server', () => {
  let server;

  beforeAll(async () => {
    const flintServer = new Flint({ listen: false });
    server = await flintServer.startServer();
  });

  describe('GET /ping', () => {
    it('returns a 200 response', (done) => {
      request(server).get('/ping').expect(200, 'PONG', done);
    });
  });

  describe('Plugin object', () => {
    it('returns the plugin object', () => {
      const FlintPlugin = new Flint.FlintPlugin();
      expect(typeof FlintPlugin).toBe('object');
    });
  });

  afterAll(() => mongoose.disconnect());
});
