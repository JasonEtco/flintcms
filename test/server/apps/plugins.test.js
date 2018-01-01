const mocks = require('../../mocks');
const supertest = require('supertest');
const mongoose = require('mongoose');
const populateDB = require('../../populatedb');
const Flint = require('../../../index');
const ConsolePlugin = require('../../fixtures/plugins/ConsolePlugin');


describe('Plugin system', () => {
  beforeAll(async function () {
    const flintServer = new Flint({ listen: false, plugins: [ConsolePlugin] });
    const server = await flintServer.startServer();
    global.agent = supertest.agent(server);

    await populateDB();

    return global.agent
      .post('/admin/login')
      .send({ email: mocks.users[0].email, password: 'password' })
      .expect(200);
  });

  it('returns a list of plugins', async () => {
    const res = await global.agent
      .post('/graphql')
      .send({
        query: `{
          plugins {
            title
            name
            version
            uid
          }
        }`,
      });

    expect(res.body).toEqual({
      data: {
        plugins: [
          {
            uid: mocks.plugins[0].uid,
            version: mocks.plugins[0].version,
            name: mocks.plugins[0].name,
            title: mocks.plugins[0].title,
          },
        ],
      },
    });
  });

  afterAll((done) => {
    mongoose.disconnect();
    done();
  });
});
