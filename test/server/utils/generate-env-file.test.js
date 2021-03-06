/* eslint-disable no-underscore-dangle */

const path = require('path')
const fs = require('fs')
const { generateEnvFile, generateSecret } = require('../../../server/utils/generate-env-file')

describe('generateSecret', () => {
  it('should generate a secret', () => {
    const secret = generateSecret()
    expect(typeof secret).toBe('string')
  })

  it('should generate three different secrets', () => {
    const s1 = generateSecret()
    const s2 = generateSecret()
    const s3 = generateSecret()
    expect(s1).not.toBe(s2)
    expect(s1).not.toBe(s3)
    expect(s2).not.toBe(s3)
  })
})

describe('generateEnvFile', () => {
  const oldHost = process.env.DB_HOST
  let logger

  beforeAll(async () => {
    const pathToEnv = path.join(__dirname, '..', '..', 'fixtures', '.env')
    fs.unlink(pathToEnv, f => f)
  })

  beforeEach(() => {
    logger = {
      info: jest.fn()
    }
  })

  it('should not generate a new .env file without DB_HOST', async () => {
    process.env.DB_HOST = 'example'
    const generatedFile = await generateEnvFile('', logger)
    return expect(generatedFile).toBe(false)
  })

  it('should generate a new .env file', async () => {
    delete process.env.DB_HOST
    const generatedFile = await generateEnvFile(path.join(__dirname, '..', '..', 'fixtures'), logger)
    return expect(generatedFile).toBe(true)
  })

  afterAll(() => {
    process.env.DB_HOST = oldHost
  })
})
