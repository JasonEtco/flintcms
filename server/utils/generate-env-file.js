/* eslint-disable no-console */

const fs = require('fs')
const path = require('path')
const chalk = require('chalk')
const log = require('debug')('flint')
const { promisify } = require('util')

const writeFileAsync = promisify(fs.writeFile)

function generateSecret (length = 32) {
  const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+-='
  let retVal = ''

  for (let i = 0, n = charset.length; i < length; ++i) {
    retVal += charset.charAt(Math.floor(Math.random() * n))
  }
  return retVal
}

const envTemplate = secret => `# It is very important that you
# DO NOT commit this file to version control.
# It should contain sensitive information, and
# should not be shared in a public environment.

# Secret settings
SESSION_SECRET=${secret}

# Mongo Credentials
DB_HOST=
DB_USER=
DB_PASS=

# Email Credentials
MAIL_HOST=
MAIL_USER=
MAIL_PASS=
`

/**
 * Generates a .env file with the appropriate variable names.
 * Returns true if it creates a new one that needs to be filled with database connection
 * strings, or false if it did not need to make one and can continue running the server.
 * @param {String} [cwd=''] - Path to the directory in which the `.env` sits.
 * @returns {Boolean}
 */
async function generateEnvFile (cwd = '') {
  const pathToEnvFile = path.resolve(cwd, '.env')

  // Checks if there is already a DB_HOST env variable
  // or if the .env file already exists. This double-check is to
  // ensure that in environments like Heroku that inject environment
  // variables not through a file, it still works.

  if (!process.env.DB_HOST && !fs.existsSync(pathToEnvFile)) {
    log(chalk.cyan('Generating .env file...'))
    const secret = generateSecret()
    await writeFileAsync(pathToEnvFile, envTemplate(secret))
    log(chalk.cyan('Finished generating .env file! Fill it with your own credentials.'))

    return true
  }

  return false
}

module.exports = { generateEnvFile, generateSecret }
