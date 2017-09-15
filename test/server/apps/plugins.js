const mocks = require('../../mocks');
const expect = require('chai').expect;
const supertest = require('supertest');
const mongoose = require('mongoose');
const populateDB = require('../../populatedb');
const Flint = require('../../../index');
const ConsolePlugin = require('../../fixtures/plugins/ConsolePlugin');
const SecondPlugin = require('../../fixtures/plugins/SecondPlugin');

describe('Plugin system', function () {
  before('Start a server and populate the db', async function () {
    const flintServer = new Flint({ listen: false, plugins: [ConsolePlugin] });
    const server = await flintServer.startServer();
    global.agent = supertest.agent(server);

    await populateDB();

    return global.agent
      .post('/admin/login')
      .send({ email: mocks.users[0].email, password: 'password' })
      .expect(200);
  });

  it('returns a list of plugins', async function () {
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

    expect(res.body).to.deep.equal({
      data: {
        plugins: [
          {
            uid: mocks.plugins[0].uid,
            version: mocks.plugins[0].version,
            name: mocks.plugins[0].name,
            title: mocks.plugins[0].title,
          },
          // {
          //   uid: SecondPlugin.uid,
          //   version: SecondPlugin.version,
          //   name: SecondPlugin.name,
          //   title: SecondPlugin.title,
          // },
        ],
      },
    });
  });

  it('edits the title of an entry before it is saved', async function () {
    const res = await global.agent
      .post('/graphql')
      .send({
        query: `mutation ($data: EntriesInput!) {
          addEntry (data: $data) {
            title
          }
        }`,
        variables: {
          data: {
            title: 'Plugin Thing',
            section: mocks.sections[0]._id,
            fields: [],
            author: mocks.users[0]._id,
          },
        },
      });

    expect(res.body.data.addEntry.title).to.equal('Edited Title');
  });

  after((done) => {
    mongoose.disconnect();
    done();
  });
});
