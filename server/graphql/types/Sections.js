const { GraphQLInputObjectType, GraphQLObjectType, GraphQLNonNull, GraphQLString, GraphQLID, GraphQLList } = require('graphql');
const { DateTime } = require('./CustomTypes');

const outputType = new GraphQLObjectType({
  name: 'Sections',
  fields: {
    _id: {
      type: new GraphQLNonNull(GraphQLID),
    },
    title: {
      type: new GraphQLNonNull(GraphQLString),
    },
    slug: {
      type: new GraphQLNonNull(GraphQLString),
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
    },
  },
});

const inputType = new GraphQLInputObjectType({
  name: 'SectionsInput',
  fields: {
    title: {
      type: new GraphQLNonNull(GraphQLString),
    },
    template: {
      type: new GraphQLNonNull(GraphQLString),
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
