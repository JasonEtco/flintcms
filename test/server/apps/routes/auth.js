/* eslint-disable func-names, prefer-arrow-callback */

const Flint = require('../../../../index.js');
const request = require('supertest');
const populateDB = require('../../../populatedb');
const mocks = require('../../../mocks');
const mongoose = require('mongoose');
const expect = require('chai').expect;

describe('auth endpoint', function () {
  this.timeout(4000);
  let server;

  before('Creates a server', async function () {
    const flintServer = new Flint({ listen: false });
    server = await flintServer.startServer();
    return populateDB();
  });

  it('redirects to admin when a verify link token does not exist', function (done) {
    request(server).get('/admin/verify')
      .query({ t: 'PIZZA' })
      .expect(302)
      .expect('Location', '/admin')
      .end(done);
  });

  it('redirects to the set password page from /verify', function (done) {
    request(server).get('/admin/verify')
      .query({ t: 'TOKEN' })
      .expect(302)
      .expect('Location', '/admin/sp/TOKEN')
      .end(done);
  });

  it('returns success false when using a non-existent token', async function () {
    const res = await request(server).post('/admin/setpassword').send({ token: 'PIZZA', password: 'password' });
    expect(res.status).to.equal(400);
    expect(res.body).to.deep.equal({ message: 'Cannot find user.' });
  });

  it('returns success false without a password', async function () {
    const res = await request(server).post('/admin/setpassword').send({ token: 'TOKEN' });
    expect(res.status).to.equal(400);
    expect(res.body).to.deep.equal({ message: 'You must include a password.' });
  });

  it('can set a new password via /admin/setpassword', async function () {
    const res = await request(server).post('/admin/setpassword').send({ token: 'TOKEN', password: 'password' });
    expect(res.status).to.equal(200);
    expect(res.body).to.deep.equal({ success: true });
    expect(res.header['set-cookie']).to.be.an('array');
  });

  it('returns an error when resetting a password for a non-existent email', function (done) {
    request(server)
      .post('/admin/forgotpassword')
      .send({ email: 'dontexist@example.com' })
      .expect(400)
      .expect('There is no user with that email.')
      .end(done);
  });

  it('returns success:true when resetting a user\'s password', async function () {
    const res = await request(server).post('/admin/forgotpassword').send({ email: mocks.users[1].email });
    expect(res.status).to.equal(200);
    expect(res.body).to.deep.equal({ success: true });
  });

  it('redirects to / after logout', function (done) {
    request(server).get('/admin/logout')
      .expect(302)
      .expect('Location', '/')
      .end(done);
  });

  after('Closes the server', function (done) {
    mongoose.disconnect(done);
  });
});
