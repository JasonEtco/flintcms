const Flint = require('../../../../index.js');
const mocks = require('../../../mocks');
const supertest = require('supertest');
const mongoose = require('mongoose');
const path = require('path');
const fs = require('fs');
const expect = require('chai').expect;
const populateDB = require('../../../populatedb');
const scaffold = require('../../../../server/utils/scaffold');

describe('assets routes', function () {
  let server;
  const pathToImageFixtures = path.join(__dirname, '..', '..', '..', 'fixtures', 'images');
  const tempPath = path.join(__dirname, '..', '..', '..', 'temp');
  const publicPath = path.join(tempPath, 'public');
  const pathToImage = path.join(pathToImageFixtures, 'image.png');

  before('Creates a server', async function () {
    scaffold(tempPath);

    const flintServer = new Flint({ publicPath, listen: false });
    server = await flintServer.startServer();
    global.agent = supertest.agent(server);

    await populateDB();

    return global.agent
      .post('/admin/login')
      .send({ email: mocks.users[0].email, password: 'password' })
      .expect(200);
  });

  it('can upload a new image', async function () {
    const res = await global.agent
      .post('/admin/api/assets')
      .field('title', 'New Image')
      .attach('file', pathToImage);

    expect(res.status).to.equal(200);
    expect(res.body.addAsset).to.include.keys({
      title: 'New Image',
      filename: 'image.png',
      mimetype: 'image/png',
      extension: 'png',
      width: 100,
      height: 100,
    });
    return expect(fs.existsSync(path.join(publicPath, 'assets', 'image.png'))).to.be.true;
  });

  it('can upload an existing image', async function () {
    const res = await global.agent
      .put(`/admin/api/assets/${mocks.assets[0]._id}`)
      .field('title', 'New Image')
      .attach('file', pathToImage);

    expect(res.status).to.equal(200);
    expect(res.body.updateAsset).to.include.keys({
      title: 'New Image',
      filename: 'image.png',
      mimetype: 'image/png',
      extension: 'png',
      width: 100,
      height: 100,
    });
    return expect(fs.existsSync(path.join(publicPath, 'assets', 'image.png'))).to.be.true;
  });

  it('returns 500 when the id does not exist', async function () {
    const res = await global.agent
      .put('/admin/api/assets/pizza')
      .attach('file', pathToImage);

    expect(res.status).to.equal(500);
  });

  describe('indexAssets', function () {
    it('removes missing images from the db on indexAssets', async function () {
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

      expect(res.body).to.deep.equal({
        data: {
          indexAssets: {
            savedFiles: [],
            removedFiles: [
              { title: 'Image Two' },
            ],
          },
        },
      });
    });

    it('adds new images to the db on indexAssets', async function () {
      const Asset = mongoose.model('Asset');
      await Asset.remove();

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

      expect(res.body).to.deep.equal({
        data: {
          indexAssets: {
            savedFiles: [
              { title: 'image.png' },
            ],
            removedFiles: [],
          },
        },
      });
    });
  });

  after('Closes the server', function (done) {
    mongoose.disconnect(done);
  });
});
