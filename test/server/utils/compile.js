/* eslint-disable func-names, prefer-arrow-callback */

const Flint = require('../../../index.js');
const request = require('supertest');
const expect = require('expect');
const populateDB = require('../../populatedb');
const mongoose = require('mongoose');
const fs = require('fs');
const { promisify } = require('util');
const path = require('path');

const readFile = promisify(fs.readFile);

describe('Compile templates', function () {
  this.timeout(4000);
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
    expect(res.text).toNotBe('no-template');
    console.log(res.text);
    expect(res.text).toBe(file);
  });

  after((done) => {
    mongoose.disconnect();
    done();
  });
});
