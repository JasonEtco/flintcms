const { GraphQLInputObjectType, GraphQLObjectType, GraphQLString, GraphQLBoolean } = require('graphql');
const { ObjectType } = require('./CustomTypes');

exports.outputType = new GraphQLObjectType({
  name: 'Site',
  fields: {
    defaultUserGroup: { type: GraphQLString },
    siteName: { type: GraphQLString },
    siteUrl: { type: GraphQLString },
    style: { type: GraphQLString },
    siteLogo: { type: ObjectType },
    allowPublicRegistration: { type: GraphQLBoolean },
  },
});

exports.inputType = new GraphQLInputObjectType({
  name: 'SiteInput',
  fields: {
    defaultUserGroup: { type: GraphQLString },
    siteName: { type: GraphQLString },
    siteUrl: { type: GraphQLString },
    style: { type: GraphQLString },
    siteLogo: { type: ObjectType },
    allowPublicRegistration: { type: GraphQLBoolean },
  },
});
