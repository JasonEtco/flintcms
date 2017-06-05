const graphqlHTTP = require('express-graphql');
const h = require('../utils/helpers');
const schema = require('../graphql');
const express = require('express');
const { app } = require('../index');
const getUserPermissions = require('../utils/getUserPermissions');
const emitSocketEvent = require('../utils/emitSocketEvent');
const events = require('../utils/events');

const io = app.get('io');

const graphql = express();

const isDeveloping = process.env.NODE_ENV !== 'production';

graphql.use(h.loggedIn);
graphql.use('/', graphqlHTTP(async req => ({
  schema,
  pretty: true,
  graphiql: isDeveloping,
  rootValue: {
    io,
    req,
    socketEvent: (event, payload) => emitSocketEvent({ io, req }, event, payload),
    events,
    perms: await getUserPermissions(req.user._id),
  },
})));

// eslint-disable-next-line no-console
console.log('[App: GraphQL] initialized.');
module.exports = graphql;
