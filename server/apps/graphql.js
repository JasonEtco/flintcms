const graphqlHTTP = require('express-graphql');
const h = require('../utils/helpers');
const schema = require('../graphql');
const express = require('express');
const app = require('../index');

const io = app.get('io');

const graphql = express();

const isDeveloping = process.env.NODE_ENV !== 'production';

graphql.use('/', h.loggedIn, graphqlHTTP({
  schema,
  pretty: true,
  graphiql: isDeveloping,
  rootValue: {
    io,
  },
}));

console.log('[App: GraphQL] initialized.');
module.exports = graphql;
