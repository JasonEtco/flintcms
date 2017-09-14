/* eslint-disable no-underscore-dangle */

const path = require('path');
const fs = require('fs');
const expect = require('chai').expect;
const { generateEnvFile, generateSecret } = require('../../../server/utils/generateEnvFile');

describe('generateSecret', function () {
  it('should generate a secret', function () {
    const secret = generateSecret();
    expect(secret).to.be.a('string');
  });

  it('should generate three different secrets', function () {
    const s1 = generateSecret();
    const s2 = generateSecret();
    const s3 = generateSecret();
    expect(s1).to.not.equal(s2);
    expect(s1).to.not.equal(s3);
    expect(s2).to.not.equal(s3);
  });
});

describe('generateEnvFile', function () {
  const oldHost = process.env.DB_HOST;

  before('delete the testing .env', async function () {
    const pathToEnv = path.join(__dirname, '..', '..', 'fixtures', '.env');
    fs.unlink(pathToEnv, f => f);
  });

  it('should not generate a new .env file without DB_HOST', async function () {
    process.env.DB_HOST = 'example';
    const generatedFile = await generateEnvFile();
    return expect(generatedFile).to.be.false;
  });

  it('should generate a new .env file', async function () {
    delete process.env.DB_HOST;
    const generatedFile = await generateEnvFile(path.join(__dirname, '..', '..', 'fixtures'));
    return expect(generatedFile).to.be.true;
  });

  after('reset old DB_HOST', function () {
    process.env.DB_HOST = oldHost;
  });
});
