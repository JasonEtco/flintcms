const mocks = require('../../../mocks');
const expect = require('expect');

it('returns a list of pages', (done) => {
  global.agent
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
      expect(JSON.parse(res.text)).toEqual({
        data: {
          pages: mocks.pages,
        },
      });
      return done();
    });
});

it('can query for a specific page by _id', function (done) {
  global.agent
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
      expect(JSON.parse(res.text)).toEqual({
        data: {
          page: { _id: mocks.pages[0]._id },
        },
      });
      return done();
    });
});

it('can delete a page from the database', function (done) {
  global.agent
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
      expect(JSON.parse(res.text)).toEqual({
        data: {
          removePage: { _id: mocks.pages[0]._id },
        },
      });
      return done();
    });
});

it('can save a page to the database', function (done) {
  global.agent
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
        },
      },
    })
    .end((err, res) => {
      if (err) { return done(err); }
      expect(JSON.parse(res.text)).toEqual({
        data: {
          addPage: {
            title: mocks.pages[0].title,
          },
        },
      });
      return done();
    });
});
