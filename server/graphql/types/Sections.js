const { GraphQLInputObjectType, GraphQLObjectType, GraphQLNonNull, GraphQLString, GraphQLID, GraphQLList } = require('graphql');

const outputType = new GraphQLObjectType({
  name: 'Sections',
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
    fields: {
      type: new GraphQLList(new GraphQLNonNull(GraphQLID)),
      description: '`id`s of fields',
    },
  },
});

const inputType = new GraphQLInputObjectType({
  name: 'SectionsInput',
  fields: {
    title: {
      type: GraphQLString,
    },
    fields: {
      type: new GraphQLList(new GraphQLNonNull(GraphQLID)),
      description: '`id`s of fields',
    },
  },
});

module.exports = {
  outputType,
  inputType,
};
