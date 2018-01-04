const Flint = require('../../../index.js');
const mongoose = require('mongoose');
const fs = require('fs');
const { promisify } = require('util');
const path = require('path');
const compileSass = require('../../../server/utils/compile-sass');

const readFile = promisify(fs.readFile);
const rimraf = promisify(require('rimraf'));

describe('Compile SCSS', () => {
  beforeAll(() => {
    global.FLINT = {
      publicPath: path.join(__dirname, '..', '..', 'temp', 'public'),
      scssEntryPoint: 'main.scss',
      scssPath: path.join(__dirname, '..', '..', 'fixtures', 'scss'),
      scssIncludePaths: [],
    };
  });

  afterEach(() => rimraf('test/temp/public'));

  it('compiles scss', async () => {
    const result = await compileSass();
    expect(result).toContain('Your SCSS has been compiled to');

    const fixture = await readFile(path.join(__dirname, '..', '..', 'fixtures', 'scss', 'main.css'), 'utf-8');
    const compiled = await readFile(path.join(__dirname, '..', '..', 'temp', 'public', 'main.css'), 'utf-8');
    expect(compiled).toBe(fixture);
  });

  describe('Disable SCSS compiling', () => {
    beforeAll(() => {
      global.FLINT.scssEntryPoint = false;
    });

    it('does not compile scss', async () => {
      const result = await compileSass();
      expect(result).toContain('SCSS compiling has been disabled in the site configuration.');
      const pathToMainCSS = path.join(__dirname, '..', '..', 'temp', 'public', 'main.css');
      return expect(fs.existsSync(pathToMainCSS)).toBe(false);
    });
  });
});

describe('Cache busting', () => {
  beforeAll(async () => {
    const flintServer = new Flint({
      scssPath: 'test/fixtures/scss',
      publicPath: 'test/temp/public',
      enableCacheBusting: true,
      listen: false,
    });

    return flintServer.startServer();
  });

  it('compiles scss with cache busting', async () => {
    const result = await compileSass();
    expect(result).toContain('Your SCSS has been compiled to');
    expect(result).not.toContain('main.css');

    const Site = mongoose.model('Site');
    const site = await Site.findOne().select('cssHash').exec();

    const fixture = await readFile(path.join(__dirname, '..', '..', 'fixtures', 'scss', 'main.css'), 'utf-8');
    const compiled = await readFile(path.join(__dirname, '..', '..', 'temp', 'public', `main-${site.cssHash}.css`), 'utf-8');
    expect(compiled).toBe(fixture);
  });

  afterAll(() => mongoose.disconnect());
});
