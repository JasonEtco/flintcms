const Flint = require('../../../');
const mocks = require('../../mocks');
const populateDB = require('../../populatedb');
const supertest = require('supertest');
const mongoose = require('mongoose');

exports.importTest = function importTest(name, path) {
  describe(name, () => {
    // eslint-disable-next-line global-require, import/no-dynamic-require
    require(path);
  });
};

exports.before = async function before() {
  this.timeout(15000);
  const flintServer = new Flint({ listen: false });
  const server = await flintServer.startServer();
  global.agent = supertest.agent(server);

  await populateDB();

  return global.agent
    .post('/admin/login')
    .send({ email: mocks.users[0].email, password: 'password' })
    .expect(200);
};

exports.setNonAdmin = function setNonAdmin(done) {
  global.agent
    .post('/graphql')
    .send({
      query: `mutation ($_id: ID!, $data: UserInput!) {
        updateUser (_id: $_id, data: $data) {
          usergroup {
            _id
            slug
          }
        }
      }`,
      variables: {
        _id: mocks.users[0]._id,
        data: {
          email: mocks.users[0].email,
          username: mocks.users[0].username,
          usergroup: mocks.usergroups[2]._id,
        },
      },
    })
    .end((err, res) => {
      if (err) { return done(err); }
      // expect(res.status).to.equal(200);
      expect(res.body).toEqual({
        data: {
          updateUser: {
            usergroup: {
              _id: mocks.usergroups[2]._id,
              slug: mocks.usergroups[2].slug,
            },
          },
        },
      });
      return done();
    });
};

exports.setAdmin = function setAdmin() {
  const User = mongoose.model('User');
  return User.findByIdAndUpdate(mocks.users[0]._id, {
    $set: { usergroup: mocks.usergroups[0]._id },
  });
};
