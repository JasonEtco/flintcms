const mongoose = require('mongoose')
const fs = require('fs')
const path = require('path')
const basename = path.basename(module.filename)

module.exports = (logger) => {
  logger.debug('Connecting to database...')
  mongoose.connect('mongodb://localhost/flint-dev')
  logger.debug('Connection established!')

  fs
    .readdirSync(__dirname)
    .filter(file =>
      (file.indexOf('.') !== 0) &&
      (file !== basename) &&
      (file.slice(-3) === '.js'))
    .forEach((file) => {
      const model = require(path.join(__dirname, file))
      mongoose.model(model.name, model)
    })

  return mongoose.connection
}
