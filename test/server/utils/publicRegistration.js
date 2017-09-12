const Flint = require('../../../index.js');
const supertest = require('supertest');
const expect = require('chai').expect;
const mongoose = require('mongoose');

describe('publicRegistration', function () {
  let server;
  let agent;
  const signupRoute = '/p/signup';
  const loginRoute = '/p/login';

  before('setup server', async function () {
    const flintServer = new Flint({
      listen: false,
      signupRoute,
      loginRoute,
    });

    server = await flintServer.startServer();
    agent = supertest.agent(server);

    const Site = mongoose.model('Site');
    await Site.findOneAndUpdate({}, { $set: { allowPublicRegistration: true } });

    return server;
  });

  it('can sign up a new user', async function () {
    await agent
      .post(signupRoute)
      .send({
        username: 'exampler',
        email: 'example@example.com',
        password: 'password',
      });

    const User = mongoose.model('User');
    const foundNewUser = await User.findOne({ username: 'exampler' });

    expect(foundNewUser).to.be.an('object');
  });

  it('can log in that new user', async function () {
    const res = await agent
      .post(loginRoute)
      .send({
        email: 'example@example.com',
        password: 'password',
      });

    expect(res.header).to.have.property('set-cookie');
  });

  after((done) => {
    mongoose.disconnect(done);
  });
});
