const mocks = require('../../../mocks');
const chai = require('chai');
const common = require('../common');

chai.use(require('chai-things'));

const expect = chai.expect;

it('returns a list of users', (done) => {
  global.agent
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
      expect(JSON.parse(res.text)).to.deep.equal({
        data: {
          users: mocks.users.map(user => ({
            _id: user._id,
            image: user.image,
            dateCreated: user.dateCreated,
            username: user.username,
            email: user.email,
            name: user.name,
          })),
        },
      });
      return done();
    });
});

it('can query for a specific user', function (done) {
  global.agent
    .post('/graphql')
    .send({
      query: `query ($_id: ID!) {
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
      expect(JSON.parse(res.text)).to.deep.equal({
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

it('can return a user\'s own details', function (done) {
  global.agent
    .post('/graphql')
    .send({
      query: `{
        user {
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
    })
    .end((err, res) => {
      if (err) { return done(err); }
      expect(JSON.parse(res.text)).to.deep.equal({
        data: {
          user: {
            _id: mocks.users[0]._id,
            image: mocks.users[0].image,
            dateCreated: mocks.users[0].dateCreated,
            username: mocks.users[0].username,
            email: mocks.users[0].email,
            usergroup: {
              _id: mocks.users[0].usergroup,
            },
            name: {
              first: mocks.users[0].name.first,
              last: mocks.users[0].name.last,
            },
          },
        },
      });
      return done();
    });
});

it('can delete a user from the database', function (done) {
  global.agent
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
      expect(JSON.parse(res.text)).to.deep.equal({
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
  global.agent
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
      expect(JSON.parse(res.text)).to.deep.equal({
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

it('throws when using an existing user\'s username', function (done) {
  global.agent
    .post('/graphql')
    .send({
      query: `
      mutation ($user: UserInput!) {
        addUser (user: $user) {
          email
        }
      }`,
      variables: {
        user: {
          username: mocks.users[0].username,
          email: mocks.users[0].email,
          usergroup: mocks.usergroups[0]._id,
        },
      },
    })
    .end((err, res) => {
      if (err) { return done(err); }
      expect(res.status).to.deep.equal(500);
      expect(JSON.parse(res.text).errors).to.contain.an.item.with.property('message', 'There is already a user with that username.');
      return done();
    });
});

it('throws when using an existing user\'s email', function (done) {
  global.agent
    .post('/graphql')
    .send({
      query: `
      mutation ($user: UserInput!) {
        addUser (user: $user) {
          email
        }
      }`,
      variables: {
        user: {
          username: 'fakeusername',
          email: mocks.users[0].email,
          usergroup: mocks.usergroups[0]._id,
        },
      },
    })
    .end((err, res) => {
      if (err) { return done(err); }
      expect(res.status).to.equal(500);
      expect(JSON.parse(res.text).errors).to.contain.an.item.with.property('message', 'There is already a user with that email.');
      return done();
    });
});

it('throws when a new user\'s usergroup does not exist', function (done) {
  global.agent
    .post('/graphql')
    .send({
      query: `
      mutation ($user: UserInput!) {
        addUser (user: $user) {
          email
          usergroup {
            _id
          }
        }
      }`,
      variables: {
        user: {
          username: 'newusername',
          email: 'new@example.com',
          usergroup: '5946e850bd887652381ecfe2',
        },
      },
    })
    .end((err, res) => {
      if (err) { return done(err); }
      expect(res.status).to.deep.equal(500);
      expect(JSON.parse(res.text).errors).to.contain.an.item.with.property('message', 'That UserGroup does not exist.');
      return done();
    });
});

it('can update an existing user', function (done) {
  global.agent
    .post('/graphql')
    .send({
      query: `
      mutation ($_id: ID!, $data: UserInput!) {
        updateUser (_id: $_id, data: $data) {
          name {
            first
          }
        }
      }`,
      variables: {
        _id: mocks.users[0]._id,
        data: {
          email: mocks.users[0].email,
          usergroup: mocks.usergroups[0]._id,
          username: mocks.users[0].username,
          name: {
            first: 'Jason',
          },
        },
      },
    })
    .end((err, res) => {
      if (err) { return done(err); }
      // expect(res.status).to.deep.equal(200);
      expect(JSON.parse(res.text)).to.deep.equal({
        data: {
          updateUser: {
            name: {
              first: 'Jason',
            },
          },
        },
      });
      return done();
    });
});

it('throws when updating a non-existing user', function (done) {
  global.agent
    .post('/graphql')
    .send({
      query: `
      mutation ($_id: ID!, $data: UserInput!) {
        updateUser (_id: $_id, data: $data) {
          name {
            first
          }
        }
      }`,
      variables: {
        _id: '5946e850bd887652381ecfe8',
        data: {
          email: mocks.users[0].email,
          username: mocks.users[0].username,
          usergroup: mocks.usergroups[0]._id,
          name: {
            first: 'Jason',
          },
        },
      },
    })
    .end((err, res) => {
      if (err) { return done(err); }
      expect(JSON.parse(res.text).errors).to.contain.an.item.with.property('message', 'There is no User with this ID.');
      return done();
    });
});

it('can reset a user\'s password', function (done) {
  global.agent
    .post('/graphql')
    .send({
      query: `mutation ($_id: ID!) {
        resetPassword (_id: $_id) {
          token
        }
      }`,
      variables: { _id: mocks.users[0]._id },
    })
    .end((err, res) => {
      if (err) { return done(err); }
      expect(JSON.parse(res.text)).to.have.property('data');
      expect(JSON.parse(res.text).data).to.have.property('resetPassword');
      expect(JSON.parse(res.text).data.resetPassword).to.have.property('token');
      expect(JSON.parse(res.text).data.resetPassword.token).to.be.a('string');
      return done();
    });
});

describe('Permissions', function () {
  before('Set to non-admin', common.setNonAdmin);

  it('throws when user is not allowed to edit other users', function (done) {
    global.agent
      .post('/graphql')
      .send({
        query: `mutation ($_id: ID!, $data: UserInput!) {
          updateUser (_id: $_id, data: $data) {
            name {
              first
            }
          }
        }`,
        variables: {
          _id: mocks.users[1]._id,
          data: {
            email: mocks.users[1].email,
            username: mocks.users[1].username,
            name: {
              first: 'Jason',
            },
          },
        },
      })
      .end((err, res) => {
        if (err) { return done(err); }
        expect(JSON.parse(res.text).errors).to.contain.an.item.with.property('message', 'You do not have permission to edit users.');
        return done();
      });
  });

  it('allows a user to edit themselves', function (done) {
    global.agent
      .post('/graphql')
      .send({
        query: `mutation ($_id: ID!, $data: UserInput!) {
          updateUser (_id: $_id, data: $data) {
            name {
              first
            }
          }
        }`,
        variables: {
          _id: mocks.users[0]._id,
          data: {
            email: mocks.users[0].email,
            username: mocks.users[0].username,
            usergroup: mocks.usergroups[2]._id,
            name: {
              first: 'Jason',
            },
          },
        },
      })
      .end((err, res) => {
        if (err) { return done(err); }
        expect(JSON.parse(res.text)).to.deep.equal({
          data: { updateUser: { name: { first: 'Jason' } } },
        });
        return done();
      });
  });

  it('returns an error when changing a user\'s usergroup', function (done) {
    global.agent
      .post('/graphql')
      .send({
        query: `mutation ($_id: ID!, $data: UserInput!) {
          updateUser (_id: $_id, data: $data) {
            name {
              first
            }
          }
        }`,
        variables: {
          _id: mocks.users[0]._id,
          data: {
            email: mocks.users[0].email,
            username: mocks.users[0].username,
            usergroup: mocks.usergroups[0]._id,
            name: {
              first: 'Jason',
            },
          },
        },
      })
      .end((err, res) => {
        if (err) { return done(err); }
        expect(JSON.parse(res.text).errors).to.contain.an.item.with.property('message', 'You do not have permission to change a user\'s usergroup.');
        return done();
      });
  });

  it('returns an error when resetting a user\'s password', function (done) {
    global.agent
      .post('/graphql')
      .send({
        query: `mutation ($_id: ID!) {
          resetPassword (_id: $_id) {
            token
          }
        }`,
        variables: { _id: mocks.users[0]._id },
      })
      .end((err, res) => {
        if (err) { return done(err); }
        expect(JSON.parse(res.text).errors).to.contain.an.item.with.property('message', 'You do not have permission to manage users.');
        return done();
      });
  });

  after('Set to admin', common.setAdmin);
});
