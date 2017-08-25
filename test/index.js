/* eslint-disable func-names, prefer-arrow-callback */

const Flint = require('../index.js');
const request = require('supertest');
const mongoose = require('mongoose');
const expect = require('expect');

const flintServer = new Flint();

describe('server', function () {
  let server;

  before('Creates a server', async function () {
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

  // describe('Closing sequences', function () {
  //   it('closes', () => {
  //     const spy = expect.createSpy();
  //     return server.close(function () {
  //       spy();
  //       return expect(spy).toHaveBeenCalled();
  //     });
  //   });

  //   it('is not listening', () => expect(server.listening).toBeFalsy());
  // });

  after('Closes the server', function (done) {
    flintServer.closeServer(done);
  });
});
