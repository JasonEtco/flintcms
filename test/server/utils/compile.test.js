const Flint = require('../../../index.js');
const request = require('supertest');
const populateDB = require('../../populatedb');
const mongoose = require('mongoose');
const mocks = require('../../mocks');
const fs = require('fs');
const { promisify } = require('util');
const path = require('path');

const readFile = promisify(fs.readFile);

describe('Compile templates', () => {
  let server;

  beforeAll(async function () {
    const flintServer = new Flint({ templatePath: 'test/fixtures/templates', listen: false });
    server = await flintServer.startServer();
    return populateDB();
  });

  it('returns the index.njk template for the homepage', async () => {
    const res = await request(server).get('/');
    const pathToFile = path.join(__dirname, '..', '..', 'fixtures', 'templates', 'index.txt');
    const file = await readFile(pathToFile, 'utf-8');
    expect(res.text).not.toBe('no-template');
    expect(res.text).toBe(file);
  });

  it(
    'returns `no-template` when the requested template does not exist',
    async () => {
      const res = await request(server).get('/no-template');
      expect(res.status).toBe(302);
      expect(res.header.location).toBe('/admin/error?r=no-template&p=/no-template&t=template-no-exist');
      expect(res.text).toBe(
        'Found. Redirecting to /admin/error?r=no-template&p=/no-template&t=template-no-exist',
      );
    },
  );

  it('returns 404 when a page does not exist', async () => {
    const res = await request(server).get('/pizza');
    const pathToFile = path.join(__dirname, '..', '..', 'fixtures', 'templates', '404.txt');
    const file = await readFile(pathToFile, 'utf-8');
    expect(res.status).toBe(404);
    expect(res.text).toBe(file);
  });

  it('returns a page with variables', async () => {
    const res = await request(server).get('/page-with-vars');
    const pathToFile = path.join(__dirname, '..', '..', 'fixtures', 'templates', 'page-with-vars.txt');
    const file = await readFile(pathToFile, 'utf-8');
    expect(res.status).toBe(200);
    expect(res.text).toBe(file);
  });

  it('returns an entry in a section', async () => {
    const url = `/${mocks.sections[0].slug}/${mocks.entries[3].slug}`;
    const res = await request(server).get(url);
    const pathToFile = path.join(__dirname, '..', '..', 'fixtures', 'templates', 'entry.txt');
    let file = await readFile(pathToFile, 'utf-8');
    file = file.replace(new RegExp('{{ this.title }}', 'g'), mocks.entries[3].title);
    expect(res.status).toBe(200);
    expect(res.text).toBe(file);
  });

  afterAll((done) => {
    mongoose.disconnect(done);
  });
});

describe('Compile in debug mode', () => {
  let server;

  beforeAll(async function () {
    const flintServer = new Flint({ templatePath: 'test/fixtures/templates', listen: false }, true);
    server = await flintServer.startServer();
    return populateDB();
  });

  it('returns the index.njk template for the homepage', async () => {
    const res = await request(server).get('/');
    expect(res.text).not.toBe('no-template');
    expect(res.text).toContain('Flint Debug Mode');
  });

  afterAll((done) => {
    mongoose.disconnect(done);
  });
});

describe('Compiler 404', () => {
  let server;

  beforeAll(async function () {
    const flintServer = new Flint({ templatePath: 'test/fixtures/templates/empty', listen: false });
    server = await flintServer.startServer();
    return server;
  });

  it('redirects to `no-template` for the 404 page', async () => {
    const res = await request(server).get('/example');
    expect(res.status).toBe(302);
    expect(res.header.location).toBe('/admin/error?r=no-template&p=404&t=404');
    expect(res.text).toBe('Found. Redirecting to /admin/error?r=no-template&p=404&t=404');
    return expect(true).toBe(true);
  });

  afterAll((done) => {
    mongoose.disconnect(done);
  });
});

describe('Custom filters', () => {
  let server;

  beforeAll(async function () {
    const flintServer = new Flint({ templatePath: 'test/fixtures/templates', listen: false });
    server = await flintServer.startServer();
    return server;
  });

  describe('field filter', () => {
    it('returns the correct value', async () => {
      const url = `/${mocks.sections[2].slug}/${mocks.entries[4].slug}`;
      const res = await request(server).get(url);
      const pathToFile = path.join(__dirname, '..', '..', 'fixtures', 'templates', 'fieldFilter.txt');
      const file = await readFile(pathToFile, 'utf-8');

      expect(res.status).toBe(200);
      expect(res.text).toBe(file);
    });
  });

  afterAll((done) => {
    mongoose.disconnect(done);
  });
});