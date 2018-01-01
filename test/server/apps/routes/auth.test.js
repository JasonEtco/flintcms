const Flint = require('../../../../index.js');
const request = require('supertest');
const populateDB = require('../../../populatedb');
const mocks = require('../../../mocks');
const mongoose = require('mongoose');

describe('auth endpoint', () => {
  this.timeout(4000);
  let server;

  beforeAll(async function () {
    const flintServer = new Flint({ listen: false });
    server = await flintServer.startServer();
    return populateDB();
  });

  test(
    'redirects to admin when a verify link token does not exist',
    (done) => {
      request(server).get('/admin/verify')
        .query({ t: 'PIZZA' })
        .expect(302)
        .expect('Location', '/admin')
        .end(done);
    },
  );

  it('redirects to the set password page from /verify', (done) => {
    request(server).get('/admin/verify')
      .query({ t: 'TOKEN' })
      .expect(302)
      .expect('Location', '/admin/sp/TOKEN')
      .end(done);
  });

  test(
    'returns success false when using a non-existent token',
    async () => {
      const res = await request(server).post('/admin/setpassword').send({ token: 'PIZZA', password: 'password' });
      expect(res.status).toBe(400);
      expect(res.body).toEqual({ message: 'Cannot find user.' });
    },
  );

  it('returns success false without a password', async () => {
    const res = await request(server).post('/admin/setpassword').send({ token: 'TOKEN' });
    expect(res.status).toBe(400);
    expect(res.body).toEqual({ message: 'You must include a password.' });
  });

  it('can set a new password via /admin/setpassword', async () => {
    const res = await request(server).post('/admin/setpassword').send({ token: 'TOKEN', password: 'password' });
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ success: true });
    expect(Array.isArray(res.header['set-cookie'])).toBe(true);
  });

  test(
    'returns an error when resetting a password for a non-existent email',
    (done) => {
      request(server)
        .post('/admin/forgotpassword')
        .send({ email: 'dontexist@example.com' })
        .expect(400)
        .expect('There is no user with that email.')
        .end(done);
    },
  );

  test(
    'returns success:true when resetting a user\'s password',
    async () => {
      const res = await request(server).post('/admin/forgotpassword').send({ email: mocks.users[1].email });
      expect(res.status).toBe(200);
      expect(res.body).toEqual({ success: true });
    },
  );

  it('redirects to / after logout', (done) => {
    request(server).get('/admin/logout')
      .expect(302)
      .expect('Location', '/')
      .end(done);
  });

  afterAll(function (done) {
    mongoose.disconnect(done);
  });
});
