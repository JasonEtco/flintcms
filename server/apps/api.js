/* eslint-disable global-require */

const express = require('express')
const chalk = require('chalk')

module.exports = (app, log) => {
  const api = express()

  api.use(require('./routes/assets')(app, log))
  api.use(require('./routes/site')(log))
  api.use(require('./routes/logs')(log))

  log(`${chalk.gray('[App: API]')} initialized.`)
  return api
}
