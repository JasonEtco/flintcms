const Flint = require('../../../index.js');
const expect = require('chai').expect;
const mongoose = require('mongoose');
const fs = require('fs');
const { promisify } = require('util');
const path = require('path');
const compileSass = require('../../../server/utils/compileSass');

const readFile = promisify(fs.readFile);
const rimraf = promisify(require('rimraf'));

describe('Compile SCSS', function () {
  before('Setup global variables', function (done) {
    global.FLINT = {
      publicPath: path.join(__dirname, '..', '..', 'temp', 'public'),
      scssEntryPoint: 'main.scss',
      scssPath: path.join(__dirname, '..', '..', 'fixtures', 'scss'),
      scssIncludePaths: [],
    };

    done();
  });

  afterEach('Delete the temp public folder', function () {
    return rimraf('test/temp/public');
  });

  it('compiles scss', async function () {
    const result = await compileSass();
    expect(result).to.include('Your SCSS has been compiled to');

    const fixture = await readFile(path.join(__dirname, '..', '..', 'fixtures', 'scss', 'main.css'), 'utf-8');
    const compiled = await readFile(path.join(__dirname, '..', '..', 'temp', 'public', 'main.css'), 'utf-8');
    expect(compiled).to.equal(fixture);
  });

  describe('Disable SCSS compiling', function () {
    before('Setup global variables', function (done) {
      global.FLINT.scssEntryPoint = false;
      done();
    });

    it('does not compile scss', async function () {
      const result = await compileSass();
      expect(result).to.include('SCSS compiling has been disabled in the site configuration.');
      const pathToMainCSS = path.join(__dirname, '..', '..', 'temp', 'public', 'main.css');
      return expect(fs.existsSync(pathToMainCSS)).to.be.false;
    });
  });
});

describe('Cache busting', function () {
  before('Create server and delete the temp folder', async function () {
    const flintServer = new Flint({
      scssPath: 'test/fixtures/scss',
      publicPath: 'test/temp/public',
      enableCacheBusting: true,
      listen: false,
    });

    return flintServer.startServer();
  });

  it('compiles scss with cache busting', async function () {
    const result = await compileSass();
    expect(result).to.include('Your SCSS has been compiled to');
    expect(result).to.not.include('main.css');

    const Site = mongoose.model('Site');
    const site = await Site.findOne().exec();

    const fixture = await readFile(path.join(__dirname, '..', '..', 'fixtures', 'scss', 'main.css'), 'utf-8');
    const compiled = await readFile(path.join(__dirname, '..', '..', 'temp', 'public', `main-${site.cacheHash}.css`), 'utf-8');
    expect(compiled).to.equal(fixture);
  });

  after((done) => {
    mongoose.disconnect(done);
  });
});
