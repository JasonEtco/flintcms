const Flint = require('../../../index.js');
const supertest = require('supertest');
const mongoose = require('mongoose');

describe('publicRegistration', () => {
  let server;
  let agent;
  const signupRoute = '/p/signup';
  const loginRoute = '/p/login';

  beforeAll(async function () {
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

  it('can sign up a new user', async () => {
    await agent
      .post(signupRoute)
      .send({
        username: 'exampler',
        email: 'example@example.com',
        password: 'password',
      });

    const User = mongoose.model('User');
    const foundNewUser = await User.findOne({ username: 'exampler' });

    expect(typeof foundNewUser).toBe('object');
  });

  it('can log in that new user', async () => {
    const res = await agent
      .post(loginRoute)
      .send({
        email: 'example@example.com',
        password: 'password',
      });

    expect(res.status).toBe(302);
    expect(res.header).toHaveProperty('location', '/admin');
  });

  afterAll((done) => {
    mongoose.disconnect(done);
  });
});
