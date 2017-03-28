const { GraphQLInputObjectType, GraphQLObjectType, GraphQLNonNull, GraphQLString, GraphQLID } = require('graphql/type');
const ObjectType = require('./objectType');

const outputType = new GraphQLObjectType({
  name: 'Field',
  fields: {
    _id: {
      type: new GraphQLNonNull(GraphQLID),
    },
    title: {
      type: GraphQLString,
    },
    slug: {
      type: GraphQLString,
    },
    handle: {
      type: GraphQLString,
    },
    instructions: {
      type: GraphQLString,
    },
    type: {
      type: GraphQLString,
    },
    dateCreated: {
      type: GraphQLString,
    },
    options: {
      type: ObjectType,
    },
  },
});
const inputType = new GraphQLInputObjectType({
  name: 'FieldInput',
  fields: {
    title: {
      type: GraphQLString,
    },
    instructions: {
      type: GraphQLString,
    },
    type: {
      type: GraphQLString,
    },
    options: {
      type: ObjectType,
    },
  },
});

module.exports = {
  outputType,
  inputType,
};
