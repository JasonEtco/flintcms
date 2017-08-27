const mocks = require('../../../__mocks__');
const expect = require('expect');

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
      expect(JSON.parse(res.text)).toEqual({
        data: {
          users: [
            {
              _id: mocks.users[0]._id,
              image: mocks.users[0].image,
              dateCreated: mocks.users[0].dateCreated,
              username: mocks.users[0].username,
              email: mocks.users[0].email,
              name: mocks.users[0].name,
            },
            {
              _id: mocks.users[1]._id,
              image: mocks.users[1].image,
              dateCreated: mocks.users[1].dateCreated,
              username: mocks.users[1].username,
              email: mocks.users[1].email,
              name: mocks.users[1].name,
            },
          ],
        },
      });
      return done();
    });
});

it('can query for a specific user', function (done) {
  global.agent
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
