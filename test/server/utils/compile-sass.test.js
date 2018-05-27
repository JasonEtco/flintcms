const Flint = require('../../../index.js')
const mongoose = require('mongoose')
const fs = require('fs')
const { promisify } = require('util')
const path = require('path')
const compileSass = require('../../../server/utils/compile-sass')

const readFile = promisify(fs.readFile)
const rimraf = promisify(require('rimraf'))

describe('Compile SCSS', () => {
  let logger

  beforeAll(() => {
    global.FLINT = {
      publicPath: path.join(__dirname, '..', '..', 'temp', 'public'),
      scssEntryPoint: 'main.scss',
      scssPath: path.join(__dirname, '..', '..', 'fixtures', 'scss'),
      scssIncludePaths: []
    }
  })

  beforeEach(() => {
    logger = {
      info: jest.fn(),
      error: jest.fn()
    }
  })

  afterEach(() => rimraf('test/temp/public'))

  it('compiles scss', async () => {
    await compileSass(logger)
    expect(logger.info.mock.calls[0][0].startsWith('[SCSS] Your SCSS has been compiled to')).toBe(true)

    const fixture = await readFile(path.join(__dirname, '..', '..', 'fixtures', 'scss', 'main.css'), 'utf-8')
    const compiled = await readFile(path.join(__dirname, '..', '..', 'temp', 'public', 'main.css'), 'utf-8')
    expect(compiled).toBe(fixture)
  })

  describe('Disable SCSS compiling', () => {
    beforeAll(() => {
      global.FLINT.scssEntryPoint = false
    })

    it('does not compile scss', async () => {
      await compileSass(logger)
      expect(logger.info).toHaveBeenCalledWith('SCSS compiling has been disabled in the site configuration.')
      const pathToMainCSS = path.join(__dirname, '..', '..', 'temp', 'public', 'main.css')
      return expect(fs.existsSync(pathToMainCSS)).toBe(false)
    })
  })
})

describe('Cache busting', () => {
  let logger

  beforeEach(() => {
    logger = {
      info: jest.fn(),
      error: jest.fn()
    }
  })

  beforeAll(async () => {
    const flintServer = new Flint({
      scssPath: 'test/fixtures/scss',
      publicPath: 'test/temp/public',
      enableCacheBusting: true,
      listen: false
    })

    return flintServer.startServer()
  })

  it('compiles scss with cache busting', async () => {
    await compileSass(logger)

    const Site = mongoose.model('Site')
    const site = await Site.findOne().select('cssHash').exec()

    const fixture = await readFile(path.join(__dirname, '..', '..', 'fixtures', 'scss', 'main.css'), 'utf-8')
    const compiled = await readFile(path.join(__dirname, '..', '..', 'temp', 'public', `main-${site.cssHash}.css`), 'utf-8')
    expect(compiled).toBe(fixture)
  })

  afterAll(() => mongoose.disconnect())
})
