const mocks = require('../../../__mocks__');
const expect = require('expect');

it('returns a list of fields', (done) => {
  global.agent
    .post('/graphql')
    .send({
      query: `
      {
        fields {
          _id
          title
          options
          dateCreated
          handle
          slug
          required
          type
        }
      }`,
    })
    .end((err, res) => {
      if (err) { return done(err); }
      expect(JSON.parse(res.text)).toEqual({
        data: {
          fields: mocks.fields,
        },
      });
      return done();
    });
});

it('can query for a specific field', function (done) {
  global.agent
    .post('/graphql')
    .send({
      query: `
      query ($_id: ID!) {
        field (_id: $_id) {
          _id
        }
      }`,
      variables: { _id: mocks.fields[0]._id },
    })
    .end((err, res) => {
      if (err) { return done(err); }
      expect(JSON.parse(res.text)).toEqual({
        data: {
          field: { _id: mocks.fields[0]._id },
        },
      });
      return done();
    });
});

it('can delete a field from the database', function (done) {
  global.agent
    .post('/graphql')
    .send({
      query: `
      mutation ($_id: ID!) {
        removeField (_id: $_id) {
          _id
        }
      }`,
      variables: { _id: mocks.fields[0]._id },
    })
    .end((err, res) => {
      if (err) { return done(err); }
      expect(JSON.parse(res.text)).toEqual({
        data: {
          removeField: { _id: mocks.fields[0]._id },
        },
      });
      return done();
    });
});

it('can save a field to the database', function (done) {
  global.agent
    .post('/graphql')
    .send({
      query: `
      mutation ($data: FieldInput!) {
        addField (data: $data) {
          title
          handle
          slug
          required
          options
          type
        }
      }`,
      variables: {
        data: {
          title: mocks.fields[0].title,
          required: mocks.fields[0].required,
          options: mocks.fields[0].options,
          type: mocks.fields[0].type,
        },
      },
    })
    .end((err, res) => {
      if (err) { return done(err); }
      expect(JSON.parse(res.text)).toEqual({
        data: {
          addField: {
            title: mocks.fields[0].title,
            slug: mocks.fields[0].slug,
            handle: mocks.fields[0].handle,
            required: mocks.fields[0].required,
            options: mocks.fields[0].options,
            type: mocks.fields[0].type,
          },
        },
      });
      return done();
    });
});
