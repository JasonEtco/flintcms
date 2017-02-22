const { GraphQLObjectType, GraphQLNonNull, GraphQLString, GraphQLID, GraphQLList } = require('graphql');
const h = require('../../utils/helpers');

const FieldType = new GraphQLObjectType({
  name: 'EntryFields',
  fields: () => ({
    fieldId: {
      type: new GraphQLNonNull(GraphQLID),
    },
    fieldSlug: {
      type: GraphQLString,
    },
    value: {
      type: GraphQLString,
    },
  }),
});

module.exports = new GraphQLObjectType({
  name: 'Entries',
  fields: () => ({
    _id: {
      type: new GraphQLNonNull(GraphQLID),
    },
    title: {
      type: GraphQLString,
      description: 'Title of the entry.',
    },
    section: {
      type: new GraphQLNonNull(GraphQLID),
    },
    slug: {
      type: GraphQLString,
    },
    dateCreated: {
      type: GraphQLString,
    },
    author: {
      type: new GraphQLNonNull(GraphQLID),
      description: 'Author of the entry.',
    },
    fields: {
      type: new GraphQLList(FieldType),
      description: 'A list of the fields used in the entry.',
    },
  }),
});
