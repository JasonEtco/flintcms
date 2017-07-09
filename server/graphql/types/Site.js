const { GraphQLInputObjectType, GraphQLObjectType, GraphQLString, GraphQLBoolean, GraphQLID } = require('graphql');
const { ObjectType } = require('./CustomTypes');

const fields = {
  defaultUserGroup: {
    type: GraphQLID,
    description: 'Mongo ID of the usergroup that new users will be assigned to by default.',
  },
  siteName: {
    type: GraphQLString,
    description: 'Name of the website.',
  },
  siteUrl: {
    type: GraphQLString,
    description: 'URL of the website.',
  },
  style: {
    type: GraphQLString,
    description: 'A string of CSS code that can be injected into templates.',
  },
  siteLogo: {
    type: ObjectType,
    description: 'A path to the site\'s logo.',
  },
  allowPublicRegistration: {
    type: GraphQLBoolean,
    description: 'Boolean to allow or disallow the public registration routes.',
  },
};

exports.outputType = new GraphQLObjectType({
  name: 'Site',
  fields,
});

exports.inputType = new GraphQLInputObjectType({
  name: 'SiteInput',
  fields,
});
