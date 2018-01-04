const Flint = require('../../../../index.js');
const mocks = require('../../../mocks');
const supertest = require('supertest');
const mongoose = require('mongoose');
const path = require('path');
const fs = require('fs');
const populateDB = require('../../../populatedb');
const scaffold = require('../../../../server/utils/scaffold');

const pathToImageFixtures = path.join(__dirname, '..', '..', '..', 'fixtures', 'images');
const tempPath = path.join(__dirname, '..', '..', '..', 'temp');
const publicPath = path.join(tempPath, 'public');
const pathToImage = path.join(pathToImageFixtures, 'image.png');

describe('assets routes', () => {
  let server;
  let agent;

  beforeAll(async () => {
    scaffold(tempPath);

    const flintServer = new Flint({ publicPath, listen: false });
    server = await flintServer.startServer();
    agent = supertest.agent(server);

    await populateDB();

    await agent
      .post('/admin/login')
      .send({ email: mocks.users[0].email, password: 'password' })
      .expect(200);
  });

  it('can upload a new image', async () => {
    const res = await agent
      .post('/admin/api/assets')
      .field('title', 'New Image')
      .attach('file', pathToImage);

    expect(res.status).toBe(200);
    expect(res.body.addAsset).toEqual(expect.objectContaining({
      title: 'New Image',
      filename: 'image.png',
      mimetype: 'image/png',
      extension: 'png',
      width: 100,
      height: 100,
    }));
    return expect(fs.existsSync(path.join(publicPath, 'assets', 'image.png'))).toBe(true);
  });

  it('can upload an existing image', async () => {
    const res = await agent
      .put(`/admin/api/assets/${mocks.assets[0]._id}`)
      .field('title', 'New Image')
      .attach('file', pathToImage);

    expect(res.status).toBe(200);
    expect(res.body.updateAsset).toEqual(expect.objectContaining({
      title: 'New Image',
      filename: 'image.png',
      mimetype: 'image/png',
      extension: 'png',
      width: 100,
      height: 100,
    }));
    return expect(fs.existsSync(path.join(publicPath, 'assets', 'image.png'))).toBe(true);
  });

  it('returns 500 when the id does not exist', async () => {
    const res = await agent
      .put('/admin/api/assets/pizza')
      .attach('file', pathToImage);

    expect(res.status).toBe(500);
  });

  describe('indexAssets', () => {
    it('removes missing images from the db on indexAssets', async () => {
      const res = await agent
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

      expect(res.body).toEqual({
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

    it('adds new images to the db on indexAssets', async () => {
      const Asset = mongoose.model('Asset');
      await Asset.remove();

      const res = await agent
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

      expect(res.body).toEqual({
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

  afterAll(() => mongoose.disconnect());
});
