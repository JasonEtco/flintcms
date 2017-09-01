const mocks = require('../../../mocks');
const expect = require('expect');

it('returns a list of sections', (done) => {
  global.agent
    .post('/graphql')
    .send({
      query: `
      {
        sections {
          _id
          title
          handle
          slug
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
  global.agent
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
  global.agent
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
  global.agent
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
