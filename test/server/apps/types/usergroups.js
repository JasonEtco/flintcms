const mocks = require('../../../__mocks__');
const expect = require('expect');
const permissions = require('../../../../server/utils/permissions.json');

const permissionsQuery = `
  permissions {
    ${Object.keys(permissions).map(key => `${key} {\n${permissions[key].map(({ name }) => `\t${name}`).join('\n')}\n}`).join('\n')}
  }
`;


it('returns a list of usergroups', (done) => {
  global.agent
    .post('/graphql')
    .send({
      query: `
      {
        usergroups {
          _id
          title
          slug
          dateCreated
          ${permissionsQuery}
        }
      }`,
    })
    .end((err, res) => {
      if (err) { return done(err); }
      expect(JSON.parse(res.text)).toEqual({
        data: {
          usergroups: mocks.usergroups,
        },
      });
      return done();
    });
});

it('can query for a specific usergroup', function (done) {
  global.agent
    .post('/graphql')
    .send({
      query: `
      query ($_id: ID!) {
        usergroup (_id: $_id) {
          _id
        }
      }`,
      variables: { _id: mocks.usergroups[0]._id },
    })
    .end((err, res) => {
      if (err) { return done(err); }
      expect(JSON.parse(res.text)).toEqual({
        data: {
          usergroup: { _id: mocks.usergroups[0]._id },
        },
      });
      return done();
    });
});

it('can delete a usergroup from the database', function (done) {
  global.agent
    .post('/graphql')
    .send({
      query: `
      mutation ($_id: ID!) {
        removeUserGroup (_id: $_id) {
          _id
        }
      }`,
      variables: { _id: mocks.usergroups[1]._id },
    })
    .end((err, res) => {
      if (err) { return done(err); }
      expect(JSON.parse(res.text)).toEqual({
        data: {
          removeUserGroup: { _id: mocks.usergroups[1]._id },
        },
      });
      return done();
    });
});

it('can save a usergroup to the database', function (done) {
  global.agent
    .post('/graphql')
    .send({
      query: `
      mutation ($data: UserGroupInput!) {
        addUserGroup (data: $data) {
          title
          ${permissionsQuery}
        }
      }`,
      variables: {
        data: {
          title: mocks.usergroups[1].title,
          permissions: mocks.usergroups[1].permissions,
        },
      },
    })
    .end((err, res) => {
      if (err) { return done(err); }
      expect(JSON.parse(res.text)).toEqual({
        data: {
          addUserGroup: {
            title: mocks.usergroups[1].title,
            permissions: mocks.usergroups[1].permissions,
          },
        },
      });
      return done();
    });
});
