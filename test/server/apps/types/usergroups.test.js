const mocks = require('../../../mocks');
const permissions = require('../../../../server/utils/permissions.json');
const common = require('../common');
const mongoose = require('mongoose');

const permissionsQuery = `
  permissions {
    ${Object.keys(permissions).map(key => `${key} {\n${permissions[key].map(({ name }) => `\t${name}`).join('\n')}\n}`).join('\n')}
  }
`;

describe('Usergroups', () => {
  let agent;

  beforeAll(async () => {
    agent = await common.before();
  });

  afterAll(() => mongoose.disconnect());

  it('returns a list of usergroups', async () => {
    const res = await agent
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
      });
    expect(res.body).toEqual({
      data: {
        usergroups: mocks.usergroups,
      },
    });
  });

  it('can query for a specific usergroup', async () => {
    const res = await agent
      .post('/graphql')
      .send({
        query: `
        query ($_id: ID!) {
          usergroup (_id: $_id) {
            _id
          }
        }`,
        variables: { _id: mocks.usergroups[0]._id },
      });
    expect(res.body).toEqual({
      data: {
        usergroup: { _id: mocks.usergroups[0]._id },
      },
    });
  });

  it('can update a usergroup in the database', async () => {
    const res = await agent
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
      });
    expect(res.body).toEqual({
      data: {
        updateUserGroup: {
          title: 'New title!',
        },
      },
    });
  });

  it('can delete a usergroup from the database', async () => {
    const res = await agent
      .post('/graphql')
      .send({
        query: `
        mutation ($_id: ID!) {
          removeUserGroup (_id: $_id) {
            _id
          }
        }`,
        variables: { _id: mocks.usergroups[1]._id },
      });
    expect(res.body).toEqual({
      data: {
        removeUserGroup: { _id: mocks.usergroups[1]._id },
      },
    });
  });

  it('can save a usergroup to the database', async () => {
    const res = await agent
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
      });
    expect(res.body).toEqual({
      data: {
        addUserGroup: {
          title: mocks.usergroups[1].title,
          permissions: mocks.usergroups[1].permissions,
        },
      },
    });
  });

  describe('Permissions', () => {
    beforeAll(async () => common.setNonAdmin(agent));

    it('cannot delete a usergroup from the database', async () => {
      const res = await agent
        .post('/graphql')
        .send({
          query: `
          mutation ($_id: ID!) {
            removeUserGroup (_id: $_id) {
              _id
            }
          }`,
          variables: { _id: mocks.usergroups[1]._id },
        });
      expect(res.body.errors).toContainEqual(expect.objectContaining({
        message: 'You do not have permission to delete User Groups.',
      }));
    });

    it('cannot save a usergroup to the database', async () => {
      const res = await agent
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
        });
      expect(res.body.errors).toContainEqual(expect.objectContaining({
        message: 'You do not have permission to add User Groups.',
      }));
    });

    it('cannot update a usergroup in the database', async () => {
      const res = await agent
        .post('/graphql')
        .send({
          query: `
          mutation ($_id: ID!, $data: UserGroupInput!) {
            updateUserGroup (_id: $_id, data: $data) {
              title
              ${permissionsQuery}
            }
          }`,
          variables: {
            _id: mocks.usergroups[1]._id,
            data: {
              title: 'Pizza Group',
              permissions: mocks.usergroups[1].permissions,
            },
          },
        });
      expect(res.body.errors).toContainEqual(expect.objectContaining({
        message: 'You do not have permission to edit User Groups.',
      }));
    });

    afterAll(common.setAdmin);
  });
});
