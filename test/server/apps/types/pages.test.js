const mocks = require('../../../mocks');
const common = require('../common');
const mongoose = require('mongoose');

describe('Pages', () => {
  let agent;

  beforeAll(async () => {
    agent = await common.before();
  });

  afterAll((done) => {
    mongoose.disconnect();
    done();
  });
  it('returns a list of pages', (done) => {
    agent
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
      })
      .end((err, res) => {
        if (err) { return done(err); }
        expect(res.body).toEqual({
          data: {
            pages: mocks.pages,
          },
        });
        return done();
      });
  });

  it('can query for a specific page by _id', (done) => {
    agent
      .post('/graphql')
      .send({
        query: `
        query ($_id: ID!) {
          page (_id: $_id) {
            _id
          }
        }`,
        variables: { _id: mocks.pages[0]._id },
      })
      .end((err, res) => {
        if (err) { return done(err); }
        expect(res.body).toEqual({
          data: {
            page: { _id: mocks.pages[0]._id },
          },
        });
        return done();
      });
  });

  it('can delete a page from the database', (done) => {
    agent
      .post('/graphql')
      .send({
        query: `
        mutation ($_id: ID!) {
          removePage (_id: $_id) {
            _id
          }
        }`,
        variables: { _id: mocks.pages[0]._id },
      })
      .end((err, res) => {
        if (err) { return done(err); }
        expect(res.body).toEqual({
          data: {
            removePage: { _id: mocks.pages[0]._id },
          },
        });
        return done();
      });
  });

  it('can save a page to the database', (done) => {
    agent
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
      })
      .end((err, res) => {
        if (err) { return done(err); }
        expect(res.body).toEqual({
          data: {
            addPage: {
              title: mocks.pages[0].title,
            },
          },
        });
        return done();
      });
  });

  it('can update a page in the database', (done) => {
    agent
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
      })
      .end((err, res) => {
        if (err) { return done(err); }
        expect(res.body).toEqual({
          data: {
            updatePage: {
              title: 'New title',
            },
          },
        });
        return done();
      });
  });

  it('sets a new homepage\'s route to `/`', (done) => {
    agent
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
      })
      .end((err, res) => {
        if (err) { return done(err); }
        expect(res.body).toEqual({
          data: {
            addPage: {
              route: '/',
            },
          },
        });
        return done();
      });
  });

  it('can overwrite an existing homepage', (done) => {
    agent
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
      })
      .end((err, res) => {
        if (err) { return done(err); }
        expect(res.body).toEqual({
          data: {
            addPage: {
              title: 'Newer Homepage',
            },
          },
        });
        return done();
      });
  });

  test(
    'overwrites the last homepage when a new homepage is saved',
    (done) => {
      agent
        .post('/graphql')
        .send({
          query: `{
            pages {
              homepage
            }
          }`,
        })
        .end((err, res) => {
          if (err) { return done(err); }
          const { data } = res.body;
          expect(data.pages).toContainEqual({ homepage: true });
          expect(data.pages.filter(p => p.homepage).length).toBe(1);
          return done();
        });
    },
  );

  test(
    'returns the correct error for a page with an existing slug',
    (done) => {
      agent
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
        })
        .end((err, res) => {
          if (err) { return done(err); }
          expect(res.body.errors).toContainEqual(expect.objectContaining({
            message: 'There is already a page with that slug.',
          }));
          return done();
        });
    },
  );

  it('returns the correct error without a fieldLayout', (done) => {
    agent
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
      })
      .end((err, res) => {
        if (err) { return done(err); }
        expect(res.body.errors).toContainEqual(expect.objectContaining({
            message: 'You must include at least one field.',
          }));
        return done();
      });
  });

  it('returns the correct error without a title', (done) => {
    agent
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
      })
      .end((err, res) => {
        if (err) { return done(err); }
        expect(res.body.errors).toContainEqual(expect.objectContaining({
            message: 'You must include a title.',
          }));
        return done();
      });
  });

  test(
    'returns the correct error for a route starting with /admin',
    (done) => {
      agent
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
        })
        .end((err, res) => {
          if (err) { return done(err); }
          expect(res.body.errors).toContainEqual(expect.objectContaining({
            message: 'Routes starting with `/admin` are reserved for Flint.',
          }));
          return done();
        });
    },
  );

  describe('Permissions', () => {
    beforeAll(done => common.setNonAdmin(done, agent));

    it('returns an error when adding a page', (done) => {
      agent
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
        })
        .end((err, res) => {
          if (err) { return done(err); }
          expect(res.body.errors[0]).toMatchObject({
            message: 'You do not have permission to create a new Page.',
          });
          return done();
        });
    });

    it('returns an error when editing a page', (done) => {
      agent
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
        })
        .end((err, res) => {
          if (err) { return done(err); }
          expect(res.body.errors[0]).toMatchObject({
            message: 'You do not have permission to edit Pages.',
          });
          return done();
        });
    });

    it('returns an error when deleting a page', (done) => {
      agent
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
        })
        .end((err, res) => {
          if (err) { return done(err); }
          expect(res.body.errors[0]).toMatchObject({
            message: 'You do not have permission to delete Pages.',
          });
          return done();
        });
    });

    afterAll(common.setAdmin);
  });
});
