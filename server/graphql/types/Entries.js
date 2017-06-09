const {
  GraphQLInputObjectType,
  GraphQLObjectType,
  GraphQLNonNull,
  GraphQLString,
  GraphQLID,
  GraphQLList,
} = require('graphql');
const { FieldType, DateTime } = require('./CustomTypes');
const userTypes = require('./Users');

const outputType = new GraphQLObjectType({
  name: 'Entries',
  fields: {
    _id: {
      type: new GraphQLNonNull(GraphQLID),
      description: 'Mongo ID string.',
    },
    title: {
      type: GraphQLString,
      description: 'Title of the entry.',
    },
    section: {
      type: new GraphQLNonNull(GraphQLID),
      description: 'The `id` of the entry\'s section.',
    },
    slug: {
      type: new GraphQLNonNull(GraphQLString),
      descriptions: 'The slug, a slugified version of a title, of the entry.',
    },
    status: {
      type: new GraphQLNonNull(GraphQLString),
      description: 'Live, Draft or Disabled',
    },
    dateCreated: {
      type: new GraphQLNonNull(DateTime),
    },
    author: {
      type: new GraphQLNonNull(userTypes.outputType),
      description: 'Author of the entry.',
    },
    fields: {
      type: new GraphQLList(FieldType.outputType),
      description: 'A list of the fields used in the entry.',
    },
    template: {
      type: GraphQLString,
      description: 'The template of the entry',
      resolve: entry => entry.getTemplate(entry),
    },
    url: {
      type: GraphQLString,
      description: 'The Url of the entry',
      resolve: entry => entry.getUrl(entry),
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
      description: 'The `id` of the entry\'s section.',
    },
    author: {
      type: GraphQLID,
      description: 'Author of the entry.',
    },
    fields: {
      type: new GraphQLList(FieldType.inputType),
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
