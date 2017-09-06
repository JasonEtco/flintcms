/* eslint-disable func-names, prefer-arrow-callback */

const Flint = require('../../../index.js');
const request = require('supertest');
const expect = require('chai').expect;
const populateDB = require('../../populatedb');
const mongoose = require('mongoose');
const mocks = require('../../mocks');
const fs = require('fs');
const { promisify } = require('util');
const path = require('path');

const readFile = promisify(fs.readFile);

describe('Compile templates', function () {
  let server;

  before('Creates a server and populates the db', async function () {
    const flintServer = new Flint({ templatePath: 'test/fixtures' });
    server = await flintServer.startServer();
    return populateDB();
  });

  it('returns the index.njk template for the homepage', async function () {
    const res = await request(server).get('/');
    const pathToFile = path.join(__dirname, '..', '..', 'fixtures', 'index.txt');
    const file = await readFile(pathToFile, 'utf-8');
    expect(res.text).to.not.equal('no-template');
    expect(res.text).to.equal(file);
  });

  it('returns the `no-template` when the requested template does not exist', async function () {
    const res = await request(server).get('/no-template');
    expect(res.status).to.equal(302);
    expect(res.text).to.equal('Found. Redirecting to /admin/error?r=no-template&p=/no-template&t=template-no-exist');
  });

  it('returns 404 when a page does not exist', async function () {
    const res = await request(server).get('/pizza');
    const pathToFile = path.join(__dirname, '..', '..', 'fixtures', '404.txt');
    const file = await readFile(pathToFile, 'utf-8');
    expect(res.status).to.equal(404);
    expect(res.text).to.equal(file);
  });

  it('returns a page with variables', async function () {
    const res = await request(server).get('/page-with-vars');
    const pathToFile = path.join(__dirname, '..', '..', 'fixtures', 'page-with-vars.txt');
    const file = await readFile(pathToFile, 'utf-8');
    expect(res.status).to.equal(200);
    expect(res.text).to.equal(file);
  });

  it('returns an entry in a section', async function () {
    const url = `/${mocks.sections[0].slug}/${mocks.entries[3].slug}`;
    const res = await request(server).get(url);
    const pathToFile = path.join(__dirname, '..', '..', 'fixtures', 'entry.txt');
    let file = await readFile(pathToFile, 'utf-8');
    file = file.replace(new RegExp('{{ this.title }}', 'g'), mocks.entries[3].title);
    expect(res.status).to.equal(200);
    expect(res.text).to.equal(file);
  });

  after((done) => {
    mongoose.disconnect();
    done();
  });
});
