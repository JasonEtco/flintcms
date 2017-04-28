const { GraphQLBoolean, GraphQLInputObjectType, GraphQLObjectType, GraphQLNonNull, GraphQLString, GraphQLID } = require('graphql');
const { DateTime } = require('./CustomTypes');
const permissions = require('../../utils/permissions');
const { capitalizeFirstChar } = require('../../utils/helpers');

// Reduce permissions to GraphQL-ready fields
const perms = Object.keys(permissions)
  .reduce((prev, curr) => Object.assign({}, prev, {
    [curr]: permissions[curr].reduce((previous, { name, defaultValue }) =>
      Object.assign({}, previous, { [name]: {
        type: GraphQLBoolean,
        defaultValue,
      } }), {}),
  }), {});

// Reduce permissions array to GraphQL-ready types, both input and output
const { outputPerms, inputPerms } = Object.keys(perms).reduce((prev, curr) => ({
  outputPerms: Object.assign(prev, {
    [curr]: {
      type: new GraphQLObjectType({
        name: `PermissionsType${capitalizeFirstChar(curr)}`,
        fields: perms[curr],
      }),
    },
  }),
  inputPerms: Object.assign(prev, {
    [curr]: {
      type: new GraphQLInputObjectType({
        name: `PermissionsTypeInput${capitalizeFirstChar(curr)}`,
        fields: perms[curr],
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
