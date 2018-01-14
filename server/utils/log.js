const fs = require('fs')
const path = require('path')

const pathToLog = path.join(global.FLINT.logsPath, 'flint.log')
const stream = fs.createWriteStream(pathToLog, { flags: 'a' })

/**
 * Logs a string to the console and adds it to the Flint log file.
 * @param {String} str - String to log to the console and the flint log file.
 * @param {Boolean} [prependTimestamp=true] - Prepend a timestamp to the string in the log file.
 * @returns {String} - Returns the string that was logged.
 */
function log (str, prependTimestamp = true) {
  /* istanbul ignore else */
  if (process.env.NODE_ENV === 'test') {
    return str
    // eslint-disable-next-line no-else-return
  } else {
    console.log(str) // eslint-disable-line no-console
    let string = str

    if (prependTimestamp) {
      const timestamp = new Date().toISOString()
      string = `[${timestamp}] - ${string}`
    }

    stream.write(`${string}\n`)
    return str
  }
}

module.exports = log
