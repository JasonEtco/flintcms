const { GraphQLBoolean, GraphQLInputObjectType, GraphQLObjectType, GraphQLNonNull, GraphQLString, GraphQLID } = require('graphql');
const { DateTime } = require('./CustomTypes');
const reducePermissionsToObject = require('../../utils/reducePermissionsToObject');
const { capitalizeFirstChar } = require('../../utils/helpers');

// Reduce permissions to GraphQL-ready fields
function reduceToGraphQLFields(previous, { name, defaultValue }) {
  return Object.assign({}, previous, { [name]: {
    type: GraphQLBoolean,
    defaultValue,
  } });
}

const permissions = reducePermissionsToObject(reduceToGraphQLFields);

// Reduce permissions fields to GraphQL-ready types, both input and output
const { outputPerms, inputPerms } = Object.keys(permissions).reduce((prev, curr) => ({
  outputPerms: Object.assign({}, prev.outputPerms, {
    [curr]: {
      type: new GraphQLObjectType({
        name: `PermissionsType${capitalizeFirstChar(curr)}`,
        fields: permissions[curr],
      }),
    },
  }),
  inputPerms: Object.assign({}, prev.inputPerms, {
    [curr]: {
      type: new GraphQLInputObjectType({
        name: `PermissionsTypeInput${capitalizeFirstChar(curr)}`,
        fields: permissions[curr],
      }),
    },
  }),
}), {});

const PermissionsType = new GraphQLObjectType({
  name: 'PermissionsType',
  fields: outputPerms,
});

const PermissionsTypeInput = new GraphQLInputObjectType({
  name: 'PermissionsTypeInput',
  fields: inputPerms,
});

exports.outputType = new GraphQLObjectType({
  name: 'UserGroup',
  fields: {
    _id: {
      type: new GraphQLNonNull(GraphQLID),
      description: 'Mongo ID string.',
    },
    title: {
      type: new GraphQLNonNull(GraphQLString),
      description: 'Title of the usergroup',
    },
    slug: {
      type: new GraphQLNonNull(GraphQLString),
      descriptions: 'The slug, a slugified version of a title, of the usergroup.',
    },
    dateCreated: {
      type: new GraphQLNonNull(DateTime),
    },
    permissions: {
      type: new GraphQLNonNull(PermissionsType),
      description: 'Permissions object that contains all the many permissions available to a user.',
    },
  },
});

exports.inputType = new GraphQLInputObjectType({
  name: 'UserGroupInput',
  fields: {
    title: {
      type: new GraphQLNonNull(GraphQLString),
      description: 'Title of the usergroup',
    },
    permissions: {
      type: new GraphQLNonNull(PermissionsTypeInput),
      description: 'Permissions object that contains all the many permissions available to a user.',
    },
  },
});
