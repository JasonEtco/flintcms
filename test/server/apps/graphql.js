/* eslint-disable func-names, prefer-arrow-callback */

const supertest = require('supertest');
const mocks = require('../../__mocks__');
const Flint = require('../../../index.js');
const mongoose = require('mongoose');
const expect = require('expect');

describe('GraphQL API', function () {
  let server;
  let agent;
  let User;

  before('Start a server', async function () {
    const flintServer = new Flint({ listen: false });
    server = await flintServer.startServer();
    User = mongoose.model('User');
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

  it('returns a list of users', (done) => {
    agent
      .post('/graphql')
      .send({
        query: `
        {
          users {
            email
          }
        }`,
      })
      .end((err, res) => {
        if (err) { return done(err); }
        expect(JSON.parse(res.text)).toEqual({
          data: {
            users: [
              {
                email: mocks.user.email,
              },
            ],
          },
        });
        return done();
      });
  });

  after((done) => {
    User.remove().exec();
    done();
  });
});
