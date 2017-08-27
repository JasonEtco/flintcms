/* eslint-disable func-names, prefer-arrow-callback */

const supertest = require('supertest');
const mocks = require('../../__mocks__');
const Flint = require('../../../index.js');
const mongoose = require('mongoose');
const expect = require('expect');
const populateDB = require('../../populatedb');

describe('GraphQL API', function () {
  let server;
  let agent;
  let User;

  before('Start a server and populates the db', async function () {
    this.timeout(15000);
    const flintServer = new Flint({ listen: false });
    server = await flintServer.startServer();
    User = mongoose.model('User');
    agent = supertest.agent(server);

    await populateDB();

    return agent
      .post('/admin/login')
      .send({ email: mocks.users[0].email, password: 'password' })
      .expect(200);
  });

  describe('Users', function () {
    it('returns a list of users', (done) => {
      agent
        .post('/graphql')
        .send({
          query: `
          {
            users {
              _id
              image
              name {
                first
                last
              }
              dateCreated
              username
              email
            }
          }`,
        })
        .end((err, res) => {
          if (err) { return done(err); }
          expect(JSON.parse(res.text)).toEqual({
            data: {
              users: mocks.users.map((o) => {
                const obj = Object.assign({}, o);
                delete obj.password;
                delete obj.usergroup;
                return obj;
              }),
            },
          });
          return done();
        });
    });

    it('can query for a specific user', function (done) {
      agent
        .post('/graphql')
        .send({
          query: `
          query ($_id: ID!) {
            user (_id: $_id) {
              _id
              image
              usergroup {
                _id
              }
              name {
                first
                last
              }
              dateCreated
              username
              email
            }
          }`,
          variables: { _id: mocks.users[1]._id },
        })
        .end((err, res) => {
          if (err) { return done(err); }
          expect(JSON.parse(res.text)).toEqual({
            data: {
              user: {
                _id: mocks.users[1]._id,
                image: mocks.users[1].image,
                dateCreated: mocks.users[1].dateCreated,
                username: mocks.users[1].username,
                email: mocks.users[1].email,
                usergroup: {
                  _id: mocks.users[1].usergroup,
                },
                name: {
                  first: mocks.users[1].name.first,
                  last: mocks.users[1].name.last,
                },
              },
            },
          });
          return done();
        });
    });

    it('can delete a user from the database', function (done) {
      agent
        .post('/graphql')
        .send({
          query: `
          mutation ($_id: ID!) {
            deleteUser (_id: $_id) {
              _id
              image
              name {
                first
                last
              }
              dateCreated
              username
              email
            }
          }`,
          variables: { _id: mocks.users[1]._id },
        })
        .end((err, res) => {
          if (err) { return done(err); }
          expect(JSON.parse(res.text)).toEqual({
            data: {
              deleteUser: {
                _id: mocks.users[1]._id,
                image: mocks.users[1].image,
                dateCreated: mocks.users[1].dateCreated,
                username: mocks.users[1].username,
                email: mocks.users[1].email,
                name: {
                  first: mocks.users[1].name.first,
                  last: mocks.users[1].name.last,
                },
              },
            },
          });
          return done();
        });
    });

    it('can save a user to the database', function (done) {
      agent
        .post('/graphql')
        .send({
          query: `
          mutation ($user: UserInput!) {
            addUser (user: $user) {
              usergroup {
                _id
              }
              name {
                first
                last
              }
              username
              email
            }
          }`,
          variables: {
            user: {
              username: mocks.users[1].username,
              email: mocks.users[1].email,
              usergroup: mocks.usergroups[0]._id,
              name: {
                first: mocks.users[1].name.first,
                last: mocks.users[1].name.last,
              },
            },
          },
        })
        .end((err, res) => {
          if (err) { return done(err); }
          expect(JSON.parse(res.text)).toEqual({
            data: {
              addUser: {
                username: mocks.users[1].username,
                usergroup: {
                  _id: mocks.users[1].usergroup,
                },
                email: mocks.users[1].email,
                name: {
                  first: mocks.users[1].name.first,
                  last: mocks.users[1].name.last,
                },
              },
            },
          });
          return done();
        });
    });
  });

  describe('Entries', function () {
    it('returns a list of entries', (done) => {
      agent
        .post('/graphql')
        .send({
          query: `
          {
            entries {
              _id
              title
            }
          }`,
        })
        .end((err, res) => {
          if (err) { return done(err); }
          expect(JSON.parse(res.text)).toEqual({
            data: {
              entries: [
                { _id: mocks.entries[0]._id, title: mocks.entries[0].title },
                { _id: mocks.entries[1]._id, title: mocks.entries[1].title },
              ],
            },
          });
          return done();
        });
    });
    it('can query for a specific entry by _id', function (done) {
      agent
        .post('/graphql')
        .send({
          query: `
          query ($_id: ID!) {
            entry (_id: $_id) {
              _id
            }
          }`,
          variables: { _id: mocks.entries[1]._id },
        })
        .end((err, res) => {
          if (err) { return done(err); }
          expect(JSON.parse(res.text)).toEqual({
            data: {
              entry: { _id: mocks.entries[1]._id },
            },
          });
          return done();
        });
    });

    it('can delete an entry from the database', function (done) {
      agent
        .post('/graphql')
        .send({
          query: `
          mutation ($_id: ID!) {
            removeEntry (_id: $_id) {
              _id
            }
          }`,
          variables: { _id: mocks.entries[1]._id },
        })
        .end((err, res) => {
          if (err) { return done(err); }
          expect(JSON.parse(res.text)).toEqual({
            data: {
              removeEntry: { _id: mocks.entries[1]._id },
            },
          });
          return done();
        });
    });

    it('can save an entry to the database', function (done) {
      agent
        .post('/graphql')
        .send({
          query: `
          mutation ($data: EntriesInput!) {
            addEntry (data: $data) {
              title
            }
          }`,
          variables: {
            data: {
              title: mocks.entries[1].title,
              author: mocks.users[0]._id,
              section: mocks.sections[0]._id,
              fields: [{
                fieldId: mocks.fields[0]._id,
                handle: mocks.fields[0].handle,
                value: 'Hello!',
              }],
            },
          },
        })
        .end((err, res) => {
          if (err) { return done(err); }
          expect(JSON.parse(res.text)).toEqual({
            data: {
              addEntry: {
                title: mocks.entries[1].title,
              },
            },
          });
          return done();
        });
    });
  });

  describe('Sections', function () {
    it('returns a list of sections', (done) => {
      agent
        .post('/graphql')
        .send({
          query: `
          {
            sections {
              _id
              title
              template
              dateCreated
              fields
            }
          }`,
        })
        .end((err, res) => {
          if (err) { return done(err); }
          expect(JSON.parse(res.text)).toEqual({
            data: {
              sections: mocks.sections,
            },
          });
          return done();
        });
    });

    it('can query for a specific section by _id', function (done) {
      agent
        .post('/graphql')
        .send({
          query: `
          query ($_id: ID!) {
            section (_id: $_id) {
              _id
            }
          }`,
          variables: { _id: mocks.sections[0]._id },
        })
        .end((err, res) => {
          if (err) { return done(err); }
          expect(JSON.parse(res.text)).toEqual({
            data: {
              section: { _id: mocks.sections[0]._id },
            },
          });
          return done();
        });
    });

    it('can delete a section from the database', function (done) {
      agent
        .post('/graphql')
        .send({
          query: `
          mutation ($_id: ID!) {
            removeSection (_id: $_id) {
              _id
            }
          }`,
          variables: { _id: mocks.sections[0]._id },
        })
        .end((err, res) => {
          if (err) { return done(err); }
          expect(JSON.parse(res.text)).toEqual({
            data: {
              removeSection: { _id: mocks.sections[0]._id },
            },
          });
          return done();
        });
    });

    it('can save a section to the database', function (done) {
      agent
        .post('/graphql')
        .send({
          query: `
          mutation ($data: SectionsInput!) {
            addSection (data: $data) {
              title
            }
          }`,
          variables: {
            data: {
              title: mocks.sections[0].title,
              template: mocks.sections[0].template,
              fields: [mocks.fields[0]._id],
            },
          },
        })
        .end((err, res) => {
          if (err) { return done(err); }
          expect(JSON.parse(res.text)).toEqual({
            data: {
              addSection: {
                title: mocks.sections[0].title,
              },
            },
          });
          return done();
        });
    });
  });

  after((done) => {
    User.remove().exec();
    mongoose.disconnect();
    done();
  });
});
