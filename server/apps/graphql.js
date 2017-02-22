const graphqlHTTP = require('express-graphql');
const h = require('../utils/helpers');
const schema = require('../graphql');
const express = require('express');

const graphql = express();

const isDeveloping = process.env.NODE_ENV !== 'production';

graphql.use('/', h.loggedIn, graphqlHTTP({
  schema,
  pretty: true,
  graphiql: isDeveloping,
}));

console.log('[App: GraphQL] initialized.');
module.exports = graphql;
