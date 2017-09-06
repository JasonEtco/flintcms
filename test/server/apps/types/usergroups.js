const mocks = require('../../../mocks');
const expect = require('chai').expect;
const permissions = require('../../../../server/utils/permissions.json');
const common = require('../common');

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
      expect(JSON.parse(res.text)).to.deep.equal({
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
      expect(JSON.parse(res.text)).to.deep.equal({
        data: {
          usergroup: { _id: mocks.usergroups[0]._id },
        },
      });
      return done();
    });
});

it('can update a usergroup in the database', function (done) {
  global.agent
    .post('/graphql')
    .send({
      query: `
      mutation ($_id: ID!, $data: UserGroupInput!) {
        updateUserGroup (_id: $_id, data: $data) {
          title
        }
      }`,
      variables: {
        _id: mocks.usergroups[1]._id,
        data: {
          title: 'New title!',
          permissions: mocks.usergroups[1].permissions,
        },
      },
    })
    .end((err, res) => {
      if (err) { return done(err); }
      expect(JSON.parse(res.text)).to.deep.equal({
        data: {
          updateUserGroup: {
            title: 'New title!',
          },
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
      expect(JSON.parse(res.text)).to.deep.equal({
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
      expect(JSON.parse(res.text)).to.deep.equal({
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

describe('Permissions', function () {
  before('Set to non-admin', common.setNonAdmin);

  it('cannot delete a usergroup from the database', function (done) {
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
        expect(JSON.parse(res.text).errors[0]).to.include({
          message: 'You do not have permission to delete User Groups.',
        });
        return done();
      });
  });

  it('cannot save a usergroup to the database', function (done) {
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
            title: 'Pizza Group',
            permissions: mocks.usergroups[1].permissions,
          },
        },
      })
      .end((err, res) => {
        if (err) { return done(err); }
        expect(JSON.parse(res.text).errors[0]).to.include({
          message: 'You do not have permission to add User Groups.',
        });
        return done();
      });
  });

  after('Set to admin', common.setAdmin);
});
