const {
  GraphQLInputObjectType,
  GraphQLObjectType,
  GraphQLNonNull,
  GraphQLString,
  GraphQLID,
  GraphQLList,
} = require('graphql');

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

const FieldTypeInput = new GraphQLInputObjectType({
  name: 'EntryFieldsInput',
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

const outputType = new GraphQLObjectType({
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
      type: new GraphQLNonNull(GraphQLString),
    },
    status: {
      type: new GraphQLNonNull(GraphQLString),
    },
    dateCreated: {
      type: new GraphQLNonNull(GraphQLString),
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

const inputType = new GraphQLInputObjectType({
  name: 'EntriesInput',
  fields: {
    title: {
      type: GraphQLString,
      description: 'Title of the entry.',
    },
    section: {
      type: GraphQLID,
    },
    author: {
      type: GraphQLID,
      description: 'Author of the entry.',
    },
    fields: {
      type: new GraphQLList(FieldTypeInput),
      description: 'A list of the fields used in the entry.',
    },
  },
});

module.exports = {
  inputType,
  outputType,
};
