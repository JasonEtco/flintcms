const mocks = require('../../../mocks');
const common = require('../common');
const mongoose = require('mongoose');

describe('Pages', () => {
  let agent;

  beforeAll(async () => {
    agent = await common.before();
  });

  afterAll(() => mongoose.disconnect());

  it('returns a list of pages', async () => {
    const res = await agent
      .post('/graphql')
      .send({
        query: `
        {
          pages {
            _id
            title
            dateCreated
            fieldLayout
            fields {
              fieldId
              handle
              value
            }
            handle
            homepage
            route
            slug
            template
          }
        }`,
      });
    expect(res.body).toEqual({
      data: {
        pages: mocks.pages,
      },
    });
  });

  it('can query for a specific page by _id', async () => {
    const res = await agent
      .post('/graphql')
      .send({
        query: `
        query ($_id: ID!) {
          page (_id: $_id) {
            _id
          }
        }`,
        variables: { _id: mocks.pages[0]._id },
      });
    expect(res.body).toEqual({
      data: {
        page: { _id: mocks.pages[0]._id },
      },
    });
  });

  it('can delete a page from the database', async () => {
    const res = await agent
      .post('/graphql')
      .send({
        query: `
        mutation ($_id: ID!) {
          removePage (_id: $_id) {
            _id
          }
        }`,
        variables: { _id: mocks.pages[0]._id },
      });
    expect(res.body).toEqual({
      data: {
        removePage: { _id: mocks.pages[0]._id },
      },
    });
  });

  it('can save a page to the database', async () => {
    const res = await agent
      .post('/graphql')
      .send({
        query: `
        mutation ($data: PagesInput!) {
          addPage (data: $data) {
            title
          }
        }`,
        variables: {
          data: {
            title: mocks.pages[0].title,
            template: mocks.pages[0].template,
            fieldLayout: [mocks.fields[0]._id],
            homepage: false,
          },
        },
      });
    expect(res.body).toEqual({
      data: {
        addPage: {
          title: mocks.pages[0].title,
        },
      },
    });
  });

  it('can update a page in the database', async () => {
    const res = await agent
      .post('/graphql')
      .send({
        query: `
        mutation ($_id: ID!, $data: PagesInput!) {
          updatePage (_id: $_id, data: $data) {
            title
          }
        }`,
        variables: {
          _id: mocks.pages[1]._id,
          data: {
            title: 'New title',
            template: mocks.pages[1].template,
            route: mocks.pages[1].route,
          },
        },
      });
    expect(res.body).toEqual({
      data: {
        updatePage: {
          title: 'New title',
        },
      },
    });
  });

  it('sets a new homepage\'s route to `/`', async () => {
    const res = await agent
      .post('/graphql')
      .send({
        query: `
        mutation ($data: PagesInput!) {
          addPage (data: $data) {
            route
          }
        }`,
        variables: {
          data: {
            title: 'New Homepage',
            homepage: true,
            route: '/pizza',
            template: mocks.pages[0].template,
            fieldLayout: [mocks.fields[0]._id],
          },
        },
      });
    expect(res.body).toEqual({
      data: {
        addPage: {
          route: '/',
        },
      },
    });
  });

  it('can overwrite an existing homepage', async () => {
    const res = await agent
      .post('/graphql')
      .send({
        query: `
        mutation ($data: PagesInput!) {
          addPage (data: $data) {
            title
          }
        }`,
        variables: {
          data: {
            title: 'Newer Homepage',
            homepage: true,
            route: '/',
            template: mocks.pages[0].template,
            fieldLayout: [mocks.fields[0]._id],
          },
        },
      });
    expect(res.body).toEqual({
      data: {
        addPage: {
          title: 'Newer Homepage',
        },
      },
    });
  });

  it(
    'overwrites the last homepage when a new homepage is saved',
    async () => {
      const res = await agent
        .post('/graphql')
        .send({
          query: `{
            pages {
              homepage
            }
          }`,
        });
      const { data } = res.body;
      expect(data.pages).toContainEqual({ homepage: true });
      expect(data.pages.filter(p => p.homepage).length).toBe(1);
    },
  );

  test(
    'returns the correct error for a page with an existing slug',
    async () => {
      const res = await agent
        .post('/graphql')
        .send({
          query: `
          mutation ($data: PagesInput!) {
            addPage (data: $data) {
              title
            }
          }`,
          variables: {
            data: {
              title: mocks.pages[0].title,
              route: '/pizza',
              template: mocks.pages[0].template,
              fieldLayout: [mocks.fields[0]._id],
            },
          },
        });
      expect(res.body.errors).toContainEqual(expect.objectContaining({
        message: 'There is already a page with that slug.',
      }));
    },
  );

  it('returns the correct error without a fieldLayout', async () => {
    const res = await agent
      .post('/graphql')
      .send({
        query: `
        mutation ($data: PagesInput!) {
          addPage (data: $data) {
            title
          }
        }`,
        variables: {
          data: {
            title: 'New Page',
            route: '/pizza',
            template: mocks.pages[0].template,
            fieldLayout: [],
          },
        },
      });
    expect(res.body.errors).toContainEqual(expect.objectContaining({
      message: 'You must include at least one field.',
    }));
  });

  it('returns the correct error without a title', async () => {
    const res = await agent
      .post('/graphql')
      .send({
        query: `
        mutation ($data: PagesInput!) {
          addPage (data: $data) {
            title
          }
        }`,
        variables: {
          data: {
            title: '',
            route: '/pizza',
            template: mocks.pages[0].template,
            fieldLayout: [mocks.fields[0]._id],
          },
        },
      });
    expect(res.body.errors).toContainEqual(expect.objectContaining({
      message: 'You must include a title.',
    }));
  });

  test(
    'returns the correct error for a route starting with /admin',
    async () => {
      const res = await agent
        .post('/graphql')
        .send({
          query: `
          mutation ($data: PagesInput!) {
            addPage (data: $data) {
              title
            }
          }`,
          variables: {
            data: {
              title: 'Admin page',
              route: '/admin/pizza',
              template: mocks.pages[0].template,
              fieldLayout: [mocks.fields[0]._id],
            },
          },
        });
      expect(res.body.errors).toContainEqual(expect.objectContaining({
        message: 'Routes starting with `/admin` are reserved for Flint.',
      }));
    },
  );

  describe('Permissions', () => {
    beforeAll(async () => common.setNonAdmin(agent));

    it('returns an error when adding a page', async () => {
      const res = await agent
        .post('/graphql')
        .send({
          query: `
          mutation ($data: PagesInput!) {
            addPage (data: $data) {
              _id
            }
          }`,
          variables: {
            data: {
              title: 'New page',
              route: '/pizza',
              template: mocks.pages[0].template,
              fieldLayout: [mocks.fields[0]._id],
            },
          },
        });
      expect(res.body.errors[0]).toMatchObject({
        message: 'You do not have permission to create a new Page.',
      });
    });

    it('returns an error when editing a page', async () => {
      const res = await agent
        .post('/graphql')
        .send({
          query: `
          mutation ($_id: ID!, $data: PagesInput!) {
            updatePage (_id: $_id, data: $data) {
              _id
            }
          }`,
          variables: {
            _id: mocks.pages[0]._id,
            data: {
              title: 'New page',
              route: '/pizza',
              template: mocks.pages[0].template,
              fieldLayout: [mocks.fields[0]._id],
            },
          },
        });
      expect(res.body.errors[0]).toMatchObject({
        message: 'You do not have permission to edit Pages.',
      });
    });

    it('returns an error when deleting a page', async () => {
      const res = await agent
        .post('/graphql')
        .send({
          query: `
          mutation ($_id: ID!) {
            removePage (_id: $_id) {
              _id
            }
          }`,
          variables: {
            _id: mocks.pages[0]._id,
          },
        });
      expect(res.body.errors[0]).toMatchObject({
        message: 'You do not have permission to delete Pages.',
      });
    });

    afterAll(common.setAdmin);
  });
});
