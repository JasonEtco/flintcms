const { GraphQLBoolean, GraphQLInputObjectType, GraphQLObjectType, GraphQLNonNull, GraphQLString, GraphQLID } = require('graphql');
const { DateTime } = require('./CustomTypes');
const { reducePermissionsToObject } = require('../../utils/permissions');
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
    },
    title: { type: new GraphQLNonNull(GraphQLString) },
    slug: { type: new GraphQLNonNull(GraphQLString) },
    dateCreated: { type: new GraphQLNonNull(DateTime) },
    permissions: {
      type: new GraphQLNonNull(PermissionsType),
    },
  },
});

exports.inputType = new GraphQLInputObjectType({
  name: 'UserGroupInput',
  fields: {
    title: { type: new GraphQLNonNull(GraphQLString) },
    permissions: {
      type: new GraphQLNonNull(PermissionsTypeInput),
    },
  },
});
