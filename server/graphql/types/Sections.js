const { GraphQLInputObjectType, GraphQLObjectType, GraphQLNonNull, GraphQLString, GraphQLID, GraphQLList } = require('graphql');
const { DateTime } = require('./CustomTypes');

const outputType = new GraphQLObjectType({
  name: 'Sections',
  fields: {
    _id: {
      type: new GraphQLNonNull(GraphQLID),
      description: 'Mongo ID string.',
    },
    title: {
      type: new GraphQLNonNull(GraphQLString),
      description: 'Title of the section.',
    },
    slug: {
      type: new GraphQLNonNull(GraphQLString),
      descriptions: 'The slug, a slugified version of a title, of the section.',
    },
    handle: {
      type: new GraphQLNonNull(GraphQLString),
      descriptions: 'The handle, a camelcase version of a title, of the section.',
    },
    fields: {
      type: new GraphQLList(new GraphQLNonNull(GraphQLID)),
      description: '`id`s of fields',
    },
    dateCreated: {
      type: new GraphQLNonNull(DateTime),
      description: 'Date Created',
    },
    template: {
      type: new GraphQLNonNull(GraphQLString),
      description: 'A path from the root of the `templates` directory to what template this section uses.',
    },
  },
});

const inputType = new GraphQLInputObjectType({
  name: 'SectionsInput',
  fields: {
    title: {
      type: new GraphQLNonNull(GraphQLString),
      description: 'Title of the section.',
    },
    template: {
      type: new GraphQLNonNull(GraphQLString),
      description: 'A path from the root of the `templates` directory to what template this section uses.',
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
