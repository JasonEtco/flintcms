const { GraphQLInputObjectType, GraphQLObjectType, GraphQLNonNull, GraphQLString, GraphQLID } = require('graphql');
const { DateTime } = require('./CustomTypes');

exports.outputType = new GraphQLObjectType({
  name: 'User',
  fields: {
    _id: {
      type: new GraphQLNonNull(GraphQLID),
    },
    email: {
      type: new GraphQLNonNull(GraphQLString),
    },
    username: {
      type: new GraphQLNonNull(GraphQLString),
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
    image: {
      type: new GraphQLNonNull(GraphQLString),
    },
  },
});

exports.inputType = new GraphQLInputObjectType({
  name: 'UserInput',
  fields: {
    email: {
      type: new GraphQLNonNull(GraphQLString),
    },
    username: {
      type: new GraphQLNonNull(GraphQLString),
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
    },
  },
});
