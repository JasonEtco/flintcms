const { GraphQLBoolean, GraphQLInputObjectType, GraphQLObjectType, GraphQLNonNull, GraphQLString, GraphQLID } = require('graphql');
const permissions = require('../../utils/permissions');
const { DateTime } = require('./CustomTypes');

const { entries, sections, users, fields } = Object.keys(permissions)
  .reduce((prev, curr) => Object.assign({}, prev, {
    [curr]: permissions[curr].reduce((p, { name, defaultValue }) => Object.assign({}, p, { [name]: {
      type: GraphQLBoolean,
      defaultValue,
    } }), {}),
  }), {});

const PermissionsType = new GraphQLObjectType({
  name: 'PermissionsType',
  fields: {
    sections: {
      type: new GraphQLObjectType({
        name: 'PermissionsTypeSections',
        fields: sections,
      }),
    },
    fields: {
      type: new GraphQLObjectType({
        name: 'PermissionsTypeFields',
        fields,
      }),
    },
    entries: {
      type: new GraphQLObjectType({
        name: 'PermissionsTypeEntries',
        fields: entries,
      }),
    },
    users: {
      type: new GraphQLObjectType({
        name: 'usersPermissionsTypeUsers',
        fields: users,
      }),
    },
  },
});

const PermissionsTypeInput = new GraphQLInputObjectType({
  name: 'PermissionsTypeInput',
  fields: {
    sections: {
      type: new GraphQLInputObjectType({
        name: 'PermissionsTypeInputSections',
        fields: sections,
      }),
    },
    fields: {
      type: new GraphQLInputObjectType({
        name: 'PermissionsTypeInputFields',
        fields,
      }),
    },
    entries: {
      type: new GraphQLInputObjectType({
        name: 'PermissionsTypeInputEntries',
        fields: entries,
      }),
    },
    users: {
      type: new GraphQLInputObjectType({
        name: 'usersPermissionsTypeInputUsers',
        fields: users,
      }),
    },
  },
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
