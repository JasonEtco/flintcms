const variables = [
  'DB_HOST',
  'SESSION_SECRET'
]

/**
 * Ensures that an array of keys exist in the process.env object.
 * @param {String[]} vars - process.env variables to check for
 * @returns {String[]} - Array of keys that *are not* defined in process.env
 */
function validateEnvVariables (vars = variables, log) {
  const missingEnvVariables = vars.filter(v => process.env[v] === undefined || process.env[v] === '')

  missingEnvVariables.forEach(v => log.error(`Missing the ${v} variable in your .env file!`))
  return missingEnvVariables
}

module.exports = validateEnvVariables
