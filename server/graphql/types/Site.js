const { GraphQLInputObjectType, GraphQLObjectType, GraphQLString } = require('graphql');
const { ObjectType } = require('./CustomTypes');

exports.outputType = new GraphQLObjectType({
  name: 'Site',
  fields: {
    defaultUserGroup: { type: GraphQLString },
    siteName: { type: GraphQLString },
    siteUrl: { type: GraphQLString },
    siteLogo: { type: ObjectType },
  },
});

exports.inputType = new GraphQLInputObjectType({
  name: 'SiteInput',
  fields: {
    defaultUserGroup: { type: GraphQLString },
    siteName: { type: GraphQLString },
    siteUrl: { type: GraphQLString },
    siteLogo: { type: ObjectType },
  },
});
