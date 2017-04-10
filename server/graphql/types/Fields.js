const { GraphQLInputObjectType, GraphQLBoolean, GraphQLObjectType, GraphQLNonNull, GraphQLString, GraphQLID } = require('graphql/type');
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
    required: {
      type: GraphQLBoolean,
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
      type: new GraphQLNonNull(GraphQLString),
    },
    required: {
      type: new GraphQLNonNull(GraphQLBoolean),
    },
    instructions: {
      type: GraphQLString,
    },
    type: {
      type: new GraphQLNonNull(GraphQLString),
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
