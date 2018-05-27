const graphqlHTTP = require('express-graphql')
const h = require('../utils/helpers')
const express = require('express')
const schema = require('../graphql')
const getUserPermissions = require('../utils/get-user-permissions')
const emitSocketEvent = require('../utils/emit-socket-event')
const events = require('../utils/events')
const log = require('../utils/log')

module.exports = (app, logger) => {
  const graphql = express()
  const io = app.get('io')

  graphql.use(h.loggedIn)
  graphql.use('/', graphqlHTTP(async req => ({
    schema,
    pretty: true,
    graphiql: global.FLINT.debugMode,
    rootValue: {
      io,
      req,
      user: req.user,
      perms: await getUserPermissions(req.user._id),
      events,
      socketEvent: (event, payload) => emitSocketEvent({ io, req }, event, payload),
      log
    }
  })))

  logger.info('[App: GraphQL] initialized.')

  return graphql
}
