const mocks = require('../../../mocks');
const expect = require('chai').expect;
const common = require('../common');

it('returns a list of assets', (done) => {
  global.agent
    .post('/graphql')
    .send({
      query: `{
        assets {
          _id
        }
      }`,
    })
    .end((err, res) => {
      if (err) { return done(err); }
      expect(res.body).to.deep.equal({
        data: {
          assets: mocks.assets.map(a => ({ _id: a._id })),
        },
      });
      return done();
    });
});

it('can query for a specific asset', async function () {
  const res = await global.agent.post('/graphql').send({
    query: `query ($_id: ID!) {
      asset (_id: $_id) {
        _id
      }
    }`,
    variables: { _id: mocks.assets[0]._id },
  });

  expect(res.body.data.asset._id).to.equal(mocks.assets[0]._id);
});

it('can update an asset in the database', function (done) {
  global.agent
    .post('/graphql')
    .send({
      query: `
      mutation ($_id: ID!, $data: AssetInput!) {
        updateAsset (_id: $_id, data: $data) {
          title
        }
      }`,
      variables: {
        _id: mocks.assets[0]._id,
        data: {
          title: 'New title!',
        },
      },
    })
    .end((err, res) => {
      if (err) { return done(err); }
      expect(res.body).to.deep.equal({
        data: {
          updateAsset: {
            title: 'New title!',
          },
        },
      });
      return done();
    });
});

it('returns an error when the there is no asset with the given id', async function () {
  const res = await global.agent.post('/graphql').send({
    query: `mutation ($_id: ID!, $data: AssetInput!) {
      updateAsset (_id: $_id, data: $data) {
        title
      }
    }`,
    variables: {
      _id: mocks.users[0]._id,
      data: {
        title: 'New title!',
      },
    },
  });

  expect(res.body.errors).to.include.an.item.with.property('message', 'There is no Asset with that id');
});

it('can delete an asset from the database', function (done) {
  global.agent
    .post('/graphql')
    .send({
      query: `
      mutation ($_id: ID!) {
        removeAsset (_id: $_id) {
          _id
        }
      }`,
      variables: { _id: mocks.assets[0]._id },
    })
    .end((err, res) => {
      if (err) { return done(err); }
      expect(res.body).to.deep.equal({
        data: {
          removeAsset: { _id: mocks.assets[0]._id },
        },
      });
      return done();
    });
});

it('returns an error for a non-existing asset', async function () {
  const res = await global.agent
    .post('/graphql')
    .send({
      query: `
      mutation ($_id: ID!) {
        removeAsset (_id: $_id) {
          _id
        }
      }`,
      variables: { _id: mocks.users[0]._id },
    });

  expect(res.body.errors).to.include.an.item.with.property('message', 'This asset doesn\'t exist.');
});

it('can save an asset to the database', function (done) {
  global.agent
    .post('/graphql')
    .send({
      query: `
      mutation ($data: AssetInput!) {
        addAsset (data: $data) {
          title
        }
      }`,
      variables: {
        data: {
          title: mocks.assets[0].title,
          filename: mocks.assets[0].filename,
          mimetype: mocks.assets[0].mimetype,
          size: mocks.assets[0].size,
          width: mocks.assets[0].width,
          height: mocks.assets[0].height,
        },
      },
    })
    .end((err, res) => {
      if (err) { return done(err); }
      expect(res.body).to.deep.equal({
        data: {
          addAsset: {
            title: mocks.assets[0].title,
          },
        },
      });
      return done();
    });
});

describe('Permissions', function () {
  before('Set to non-admin', common.setNonAdmin);

  it('cannot edit an asset in the database', function (done) {
    global.agent
      .post('/graphql')
      .send({
        query: `
        mutation ($_id: ID!, $data: AssetInput!) {
          updateAsset (_id: $_id, data: $data) {
            _id
          }
        }`,
        variables: {
          _id: mocks.assets[0]._id,
          data: {
            title: 'New title!',
          },
        },
      })
      .end((err, res) => {
        if (err) { return done(err); }
        expect(res.body.errors).to.include.an.item.with.property('message', 'You do not have permission to edit assets.');
        return done();
      });
  });

  it('cannot delete an asset from the database', function (done) {
    global.agent
      .post('/graphql')
      .send({
        query: `
        mutation ($_id: ID!) {
          removeAsset (_id: $_id) {
            _id
          }
        }`,
        variables: { _id: mocks.assets[0]._id },
      })
      .end((err, res) => {
        if (err) { return done(err); }
        expect(res.body.errors).to.include.an.item.with.property('message', 'You do not have permission to delete assets.');
        return done();
      });
  });

  it('cannot save an asset to the database', function (done) {
    global.agent
      .post('/graphql')
      .send({
        query: `
        mutation ($data: AssetInput!) {
          addAsset (data: $data) {
            title
          }
        }`,
        variables: {
          data: {
            title: mocks.assets[0].title,
            filename: mocks.assets[0].filename,
            mimetype: mocks.assets[0].mimetype,
            size: mocks.assets[0].size,
            width: mocks.assets[0].width,
            height: mocks.assets[0].height,
          },
        },
      })
      .end((err, res) => {
        if (err) { return done(err); }
        expect(res.body.errors).to.include.an.item.with.property('message', 'You do not have permission to add new assets.');
        return done();
      });
  });

  it('cannot index assets', async function () {
    const res = await global.agent
      .post('/graphql')
      .send({
        query: `mutation {
          indexAssets {
            savedFiles {
              title
            }
            removedFiles {
              title
            }
          }
        }`,
      });

    expect(res.body.errors).to.include.an.item.with.property('message', 'You do not have permission to re-index assets.');
  });

  after('Set to admin', common.setAdmin);
});
