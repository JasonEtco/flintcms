const supertest = require('supertest');
const mocks = require('../../mocks');
const Flint = require('../../../index.js');
const mongoose = require('mongoose');
const expect = require('chai').expect;

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

  it('creates a first new user', async function () {
    const res = await agent.post('/admin/firstuser').send(mocks.user);
    expect(res.status).to.equal(200);
    expect(JSON.parse(res.text)).to.deep.equal({ success: true });
  });

  it('returns a message when a user already exists', async function () {
    const res = await agent.post('/admin/firstuser').send(mocks.user);
    expect(res.status).to.equal(200);
    expect(JSON.parse(res.text)).to.deep.equal({
      success: false,
      message: 'There is already a user in the database.',
    });
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
