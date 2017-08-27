/* eslint-disable func-names, prefer-arrow-callback */

const supertest = require('supertest');
const mocks = require('../../__mocks__');
const Flint = require('../../../index.js');
const mongoose = require('mongoose');

describe('First time install', function () {
  let server;
  let agent;

  before('Start a server', async function () {
    const flintServer = new Flint({ listen: false });
    server = await flintServer.startServer();
    await mongoose.model('User').remove();
    agent = supertest.agent(server);
    return server;
  });

  it('creates a first new user', function (done) {
    agent
      .post('/admin/firstuser')
      .send(mocks.user)
      .expect(200)
      .end(done);
  });

  it('logs in a user', function (done) {
    agent
      .post('/admin/login')
      .send({ email: mocks.user.email, password: mocks.user.password })
      .expect(200)
      .end(done);
  });

  after((done) => {
    mongoose.disconnect();
    done();
  });
});
