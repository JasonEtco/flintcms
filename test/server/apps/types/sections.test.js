const mocks = require('../../../mocks');
const common = require('../common');
const mongoose = require('mongoose');

describe('Sections', () => {
  let agent;

  beforeAll(async () => {
    agent = await common.before();
  });

  afterAll((done) => {
    mongoose.disconnect();
    done();
  });

  it('returns a list of sections', async () => {
    const res = await agent
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
      });
    expect(res.body).toEqual({
      data: {
        sections: mocks.sections,
      },
    });
  });

  it('can query for a specific section by _id', async () => {
    const res = await agent
      .post('/graphql')
      .send({
        query: `
        query ($_id: ID!) {
          section (_id: $_id) {
            _id
          }
        }`,
        variables: { _id: mocks.sections[0]._id },
      });
    expect(res.body).toEqual({
      data: {
        section: { _id: mocks.sections[0]._id },
      },
    });
  });

  it('can delete a section from the database', async () => {
    const res = await agent
      .post('/graphql')
      .send({
        query: `
        mutation ($_id: ID!) {
          removeSection (_id: $_id) {
            _id
          }
        }`,
        variables: { _id: mocks.sections[0]._id },
      });
    expect(res.body).toEqual({
      data: {
        removeSection: { _id: mocks.sections[0]._id },
      },
    });
  });

  it('can save a section to the database', async () => {
    const res = await agent
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
      });
    expect(res.body).toEqual({
      data: {
        addSection: {
          title: mocks.sections[0].title,
        },
      },
    });
  });

  it(
    'returns an error when saving a section without any fields',
    (done) => {
      agent
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
              title: 'Hello!',
              template: mocks.sections[0].template,
              fields: [],
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
    },
  );

  it(
    'returns an error when saving a section without a title',
    (done) => {
      agent
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
              title: '',
              template: mocks.sections[0].template,
              fields: [mocks.fields[0]._id],
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
    },
  );

  it('can update a section in the database', async () => {
    const res = await agent
      .post('/graphql')
      .send({
        query: `
        mutation ($_id: ID!, $data: SectionsInput!) {
          updateSection (_id: $_id, data: $data) {
            title
          }
        }`,
        variables: {
          _id: mocks.sections[1]._id,
          data: {
            title: 'New title',
            template: mocks.sections[1].template,
            fields: [mocks.fields[0]._id],
          },
        },
      });
    expect(res.body).toEqual({
      data: {
        updateSection: {
          title: 'New title',
        },
      },
    });
  });
});
