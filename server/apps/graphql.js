const graphqlHTTP = require('express-graphql');
const h = require('../utils/helpers');
const express = require('express');
const chalk = require('chalk');
const { app } = require('../index');
const schema = require('../graphql');
const getUserPermissions = require('../utils/getUserPermissions');
const emitSocketEvent = require('../utils/emitSocketEvent');
const events = require('../utils/events');
const log = require('../utils/log');

const io = app.get('io');

const graphql = express();

graphql.use(h.loggedIn);
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
    log,
  },
})));

// eslint-disable-next-line no-console
console.log(`${chalk.gray('[App: GraphQL]')} initialized.`);
module.exports = graphql;
