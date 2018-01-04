const mocks = require('../../mocks');
const supertest = require('supertest');
const mongoose = require('mongoose');
const populateDB = require('../../populatedb');
const Flint = require('../../../index');
const ConsolePlugin = require('../../fixtures/plugins/ConsolePlugin');


describe('Plugin system', () => {
  let agent;

  beforeAll(async () => {
    const flintServer = new Flint({ listen: false, plugins: [ConsolePlugin] });
    const server = await flintServer.startServer();
    agent = supertest.agent(server);

    await populateDB();
  });

  it('returns a list of plugins', async () => {
    const res = await agent
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

  afterAll(() => mongoose.disconnect());
});
