const graphqlHTTP = require('express-graphql');
const h = require('../utils/helpers');
const express = require('express');
const chalk = require('chalk');
const schema = require('../graphql');
const getUserPermissions = require('../utils/getUserPermissions');
const emitSocketEvent = require('../utils/emitSocketEvent');
const events = require('../utils/events');
const log = require('../utils/log');

module.exports = (app) => {
  const graphql = express();
  const io = app.get('io');

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


  const testing = process.env.NODE_ENV === 'test';

  // eslint-disable-next-line no-console
  if (!testing) console.log(`${chalk.gray('[App: GraphQL]')} initialized.`);

  return graphql;
};

