const {
  GraphQLInputObjectType,
  GraphQLObjectType,
  GraphQLNonNull,
  GraphQLString,
  GraphQLID,
  GraphQLList,
} = require('graphql');
const { ObjectType, DateTime } = require('./CustomTypes');

const FieldType = new GraphQLObjectType({
  name: 'EntryFields',
  fields: {
    fieldId: {
      type: new GraphQLNonNull(GraphQLID),
    },
    handle: {
      type: GraphQLString,
    },
    value: {
      type: ObjectType,
    },
  },
});

const FieldTypeInput = new GraphQLInputObjectType({
  name: 'EntryFieldsInput',
  fields: {
    fieldId: {
      type: new GraphQLNonNull(GraphQLID),
    },
    handle: {
      type: GraphQLString,
    },
    value: {
      type: ObjectType,
    },
  },
});

const outputType = new GraphQLObjectType({
  name: 'Entries',
  fields: {
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
    sectionSlug: {
      type: GraphQLString,
      resolve: entry => entry.getSectionSlug(),
    },
    slug: {
      type: new GraphQLNonNull(GraphQLString),
    },
    status: {
      type: new GraphQLNonNull(GraphQLString),
      description: 'Live, Draft or Disabled',
    },
    dateCreated: {
      type: new GraphQLNonNull(DateTime),
    },
    author: {
      type: new GraphQLNonNull(GraphQLID),
      description: 'Author of the entry.',
    },
    fields: {
      type: new GraphQLList(FieldType),
      description: 'A list of the fields used in the entry.',
    },
    template: {
      type: GraphQLString,
      description: 'The template of the entry',
      resolve: entry => entry.getTemplate(),
    },
    url: {
      type: GraphQLString,
      description: 'The Url of the entry',
      resolve: entry => entry.getUrl(),
    },
  },
});

const inputType = new GraphQLInputObjectType({
  name: 'EntriesInput',
  fields: {
    title: {
      type: GraphQLString,
      description: 'Title of the entry.',
    },
    status: {
      type: GraphQLString,
      description: 'Live, Draft or Disabled',
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
    dateCreated: {
      type: GraphQLString,
    },
  },
});

module.exports = {
  inputType,
  outputType,
};
