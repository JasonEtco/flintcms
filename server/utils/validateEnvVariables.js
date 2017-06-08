const chalk = require('chalk');

const variables = [
  'DB_HOST',
  'SESSION_SECRET',
  'MAIL_HOST',
  'MAIL_USER',
  'MAIL_PASS',
];

/**
 * Ensures that an array of keys exist in the process.env object.
 * @param {String[]} vars - process.env variables to check for
 * @returns {String[]} - Array of keys that *are not* defined in process.env
 */
function validateEnvVariables(vars = variables) {
  const missingEnvVariables = vars.filter(v => process.env[v] === undefined || process.env[v] === '');

  // eslint-disable-next-line no-console
  missingEnvVariables.forEach(v => console.log(chalk.red(`Missing the ${v} variable in your .env file!`)));
  return missingEnvVariables;
}

module.exports = validateEnvVariables;
