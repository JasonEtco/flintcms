const Flint = require('../../../index.js');
const expect = require('chai').expect;
const request = require('supertest');
const mongoose = require('mongoose');

describe('admin routes', function () {
  let server;

  before('Creates a server', async function () {
    const flintServer = new Flint({ listen: false });
    server = await flintServer.startServer();
    return server;
  });

  it('returns the correct response for /admin/login', async function () {
    const res = await request(server).get('/admin/login');
    expect(res.status).to.equal(200);
    expect(res.text).to.include('<!DOCTYPE html>');
  });

  it('returns the correct response for any route', async function () {
    const res = await request(server).get('/admin/asdfsdfsadfsadf');
    expect(res.status).to.equal(200);
    expect(res.text).to.include('<!DOCTYPE html>');
  });

  after('Closes the server', function (done) {
    mongoose.disconnect(done);
  });
});
