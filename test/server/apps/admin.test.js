const Flint = require('../../../index.js');
const request = require('supertest');
const mongoose = require('mongoose');

describe('admin routes', () => {
  let server;

  beforeAll(async () => {
    const flintServer = new Flint({ listen: false });
    server = await flintServer.startServer();
  });

  it('returns the correct response for /admin/login', async () => {
    const res = await request(server).get('/admin/login');
    expect(res.status).toBe(200);
    expect(res.text).toMatchSnapshot();
  });

  afterAll(() => mongoose.disconnect());
});
