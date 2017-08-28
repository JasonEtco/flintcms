const { GraphQLInputObjectType, GraphQLObjectType, GraphQLNonNull, GraphQLString, GraphQLID } = require('graphql');
const { DateTime } = require('./CustomTypes');
const { outputType } = require('./UserGroups');

exports.outputType = new GraphQLObjectType({
  name: 'User',
  fields: {
    _id: {
      type: new GraphQLNonNull(GraphQLID),
      description: 'Mongo ID string.',
    },
    email: {
      type: new GraphQLNonNull(GraphQLString),
      description: 'User\'s email.',
    },
    username: {
      type: new GraphQLNonNull(GraphQLString),
      description: 'Username associated with the user\'s account.',
    },
    name: { type: new GraphQLObjectType({
      name: 'UserName',
      fields: {
        first: { type: GraphQLString },
        last: { type: GraphQLString },
      },
    }) },
    dateCreated: {
      type: new GraphQLNonNull(DateTime),
    },
    token: {
      type: GraphQLString,
      description: 'A temporary token used for account activation and password resets',
    },
    image: {
      type: GraphQLString,
      description: 'User\'s avatar.',
    },
    usergroup: {
      type: new GraphQLNonNull(outputType),
      description: 'What usergroup the user belongs to, and thereby what permissions they have.',
    },
  },
});

exports.inputType = new GraphQLInputObjectType({
  name: 'UserInput',
  fields: {
    email: {
      type: new GraphQLNonNull(GraphQLString),
      description: 'User\'s email.',
    },
    username: {
      type: new GraphQLNonNull(GraphQLString),
      description: 'Username associated with the user\'s account.',
    },
    name: { type: new GraphQLInputObjectType({
      name: 'UserNameInput',
      fields: {
        first: { type: GraphQLString },
        last: { type: GraphQLString },
      },
    }) },
    image: {
      type: GraphQLString,
      description: 'User\'s avatar.',
    },
    usergroup: {
      type: GraphQLID,
      description: 'What usergroup the user belongs to, and thereby what permissions they have.',
    },
  },
});
