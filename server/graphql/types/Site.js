const { GraphQLInputObjectType, GraphQLObjectType, GraphQLString } = require('graphql');

exports.outputType = new GraphQLObjectType({
  name: 'Site',
  fields: {
    defaultUserGroup: { type: GraphQLString },
    siteName: { type: GraphQLString },
    siteUrl: { type: GraphQLString },
  },
});

exports.inputType = new GraphQLInputObjectType({
  name: 'SiteInput',
  fields: {
    defaultUserGroup: { type: GraphQLString },
    siteName: { type: GraphQLString },
    siteUrl: { type: GraphQLString },
  },
});
