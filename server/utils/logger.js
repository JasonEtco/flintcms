const Logger = require('bunyan')
const bunyanFormat = require('bunyan-format')

function toBunyanLogLevel (level) {
  switch (level) {
    case 'info':
    case 'trace':
    case 'debug':
    case 'warn':
    case 'error':
    case 'fatal':
    case undefined:
      return level
    default:
      throw new Error('Invalid log level')
  }
}

function toBunyanFormat (format) {
  switch (format) {
    case 'short':
    case 'long':
    case 'simple':
    case 'json':
    case 'bunyan':
    case undefined:
      return format
    default:
      throw new Error('Invalid log format')
  }
}

const logger = new Logger({
  level: toBunyanLogLevel(process.env.LOG_LEVEL || 'info'),
  name: 'flintcms',
  stream: new bunyanFormat({ outputMode: toBunyanFormat(process.env.LOG_FORMAT || 'short') }) // eslint-disable-line
})

module.exports = logger
