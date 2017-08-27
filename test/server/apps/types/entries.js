const mocks = require('../../../__mocks__');
const expect = require('expect');

it('returns a list of entries', (done) => {
  global.agent
    .post('/graphql')
    .send({
      query: `
      {
        entries {
          _id
          title
        }
      }`,
    })
    .end((err, res) => {
      if (err) { return done(err); }
      expect(JSON.parse(res.text)).toEqual({
        data: {
          entries: [
            { _id: mocks.entries[0]._id, title: mocks.entries[0].title },
            { _id: mocks.entries[1]._id, title: mocks.entries[1].title },
          ],
        },
      });
      return done();
    });
});

it('can query for a specific entry by _id', function (done) {
  global.agent
    .post('/graphql')
    .send({
      query: `
      query ($_id: ID!) {
        entry (_id: $_id) {
          _id
        }
      }`,
      variables: { _id: mocks.entries[1]._id },
    })
    .end((err, res) => {
      if (err) { return done(err); }
      expect(JSON.parse(res.text)).toEqual({
        data: {
          entry: { _id: mocks.entries[1]._id },
        },
      });
      return done();
    });
});

it('can delete an entry from the database', function (done) {
  global.agent
    .post('/graphql')
    .send({
      query: `
      mutation ($_id: ID!) {
        removeEntry (_id: $_id) {
          _id
        }
      }`,
      variables: { _id: mocks.entries[1]._id },
    })
    .end((err, res) => {
      if (err) { return done(err); }
      expect(JSON.parse(res.text)).toEqual({
        data: {
          removeEntry: { _id: mocks.entries[1]._id },
        },
      });
      return done();
    });
});

it('can save an entry to the database', function (done) {
  global.agent
    .post('/graphql')
    .send({
      query: `
      mutation ($data: EntriesInput!) {
        addEntry (data: $data) {
          title
        }
      }`,
      variables: {
        data: {
          title: mocks.entries[1].title,
          author: mocks.users[0]._id,
          section: mocks.sections[0]._id,
          fields: [{
            fieldId: mocks.fields[0]._id,
            handle: mocks.fields[0].handle,
            value: 'Hello!',
          }],
        },
      },
    })
    .end((err, res) => {
      if (err) { return done(err); }
      expect(JSON.parse(res.text)).toEqual({
        data: {
          addEntry: {
            title: mocks.entries[1].title,
          },
        },
      });
      return done();
    });
});
