const { GraphQLInputObjectType, GraphQLBoolean, GraphQLObjectType, GraphQLNonNull, GraphQLString, GraphQLID } = require('graphql/type');
const { ObjectType, DateTime } = require('./CustomTypes');

const outputType = new GraphQLObjectType({
  name: 'Field',
  fields: {
    _id: {
      type: new GraphQLNonNull(GraphQLID),
      description: 'Mongo ID string.',
    },
    title: {
      type: new GraphQLNonNull(GraphQLString),
      description: 'Title of the field.',
    },
    slug: {
      type: new GraphQLNonNull(GraphQLString),
      descriptions: 'The slug, a slugified version of a title, of the field.',
    },
    handle: {
      type: new GraphQLNonNull(GraphQLString),
      descriptions: 'A camelcase version of the field\'s title for an easier use while templating.',
    },
    instructions: {
      type: GraphQLString,
      description: 'Instructions shown above the field in the dashboard.',
    },
    type: {
      type: new GraphQLNonNull(GraphQLString),
      description: 'The type of field.',
    },
    required: {
      type: GraphQLBoolean,
      description: 'A boolean to represent if this field is required in the dashboard or not.',
    },
    dateCreated: {
      type: new GraphQLNonNull(DateTime),
    },
    options: {
      type: ObjectType,
      description: 'An object of the options/values for a field.',
    },
  },
});
const inputType = new GraphQLInputObjectType({
  name: 'FieldInput',
  fields: {
    title: {
      type: new GraphQLNonNull(GraphQLString),
      description: 'Title of the field.',
    },
    required: {
      type: GraphQLBoolean,
      defaultValue: false,
      description: 'A boolean to represent if this field is required in the dashboard or not.',
    },
    instructions: {
      type: GraphQLString,
      description: 'Instructions shown above the field in the dashboard.',
    },
    type: {
      type: new GraphQLNonNull(GraphQLString),
      description: 'The type of field.',
    },
    options: {
      type: ObjectType,
      description: 'An object of the options/values for a field.',
    },
  },
});

module.exports = {
  outputType,
  inputType,
};
