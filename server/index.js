/* eslint-disable no-console, global-require */

const express = require('express')
const session = require('cookie-session')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const morgan = require('morgan')
const path = require('path')
const compression = require('compression')
const passport = require('passport')
const fs = require('fs')
const { Server } = require('http')
const io = require('socket.io')
const shutter = require('http-shutdown')

module.exports = (log) => {
  require('./utils/passport')(passport)

  const app = express()
  const server = shutter(Server(app))
  app.set('io', io(server))

  /* istanbul ignore if */
  if (process.env.NODE_ENV !== 'test') {
    const accessLogStream = fs.createWriteStream(path.join(global.FLINT.logsPath, 'http-requests.log'), { flags: 'a' })
    app.use(morgan('combined', { stream: accessLogStream }))
  }

  app.use(cookieParser())
  app.use(bodyParser.urlencoded({ extended: true }))
  app.use(bodyParser.json())
  app.use(session({ secret: process.env.SESSION_SECRET }))

  app.use(passport.initialize())
  app.use(passport.session())

  app.use(compression())

  // `/ping` endpoint for testing and uptime monitoring
  app.get('/ping', (req, res) => res.end('PONG'))

  // Auto-authenticate in test
  if (process.env.NODE_ENV === 'test') {
    app.use((req, res, next) => {
      const user = require('../test/mocks/users')[0]
      req.user = user
      next()
    })
  }

  app.use(global.FLINT.publicUrl, express.static(global.FLINT.publicPath))
  // app.use('/manifest.json', express.static(path.join(__dirname, '..', 'manifest.json')));
  app.use('/admin', require('./apps/admin')(app, log))
  app.use('/graphql', require('./apps/graphql')(app, log))
  app.use(require('./utils/public-registration')(log))

  // ===== Template Routes

  app.use(require('./utils/template-routes'))

  return server
}
