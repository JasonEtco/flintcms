const { GraphQLBoolean, GraphQLInputObjectType, GraphQLObjectType, GraphQLNonNull, GraphQLString, GraphQLID } = require('graphql');

const PermissionsType = new GraphQLObjectType({
  name: 'PermissionsType',
  fields: {
    // Sections
    canAddSections: { type: GraphQLBoolean },
    canDeleteSections: { type: GraphQLBoolean },
    canEditSections: { type: GraphQLBoolean },

    // Fields
    canAddFields: { type: GraphQLBoolean },
    canDeleteFields: { type: GraphQLBoolean },
    canEditFields: { type: GraphQLBoolean },

    // Entries
    canAddEntries: { type: GraphQLBoolean },
    canDeleteEntries: { type: GraphQLBoolean },
    canOnlyEditOwnEntries: { type: GraphQLBoolean },
    canEditLive: { type: GraphQLBoolean },
    canEditDrafts: { type: GraphQLBoolean },
    canChangeEntryStatus: { type: GraphQLBoolean },

    // Users
    canManageUsers: { type: GraphQLBoolean },
    canManageUserGroups: { type: GraphQLBoolean },
  },
});

const PermissionsTypeInput = new GraphQLInputObjectType({
  name: 'PermissionsTypeInput',
  fields: {
    // Sections
    canAddSections: {
      type: GraphQLBoolean,
      defaultValue: false,
    },
    canDeleteSections: {
      type: GraphQLBoolean,
      defaultValue: false,
    },
    canEditSections: {
      type: GraphQLBoolean,
      defaultValue: false,
    },

    // Fields
    canAddFields: {
      type: GraphQLBoolean,
      defaultValue: false,
    },
    canDeleteFields: {
      type: GraphQLBoolean,
      defaultValue: false,
    },
    canEditFields: {
      type: GraphQLBoolean,
      defaultValue: false,
    },

    // Entries
    canAddEntries: {
      type: GraphQLBoolean,
      defaultValue: false,
    },
    canDeleteEntries: {
      type: GraphQLBoolean,
      defaultValue: false,
    },
    canOnlyEditOwnEntries: {
      type: GraphQLBoolean,
      defaultValue: false,
    },
    canEditLive: {
      type: GraphQLBoolean,
      defaultValue: false,
    },
    canEditDrafts: {
      type: GraphQLBoolean,
      defaultValue: false,
    },
    canChangeEntryStatus: {
      type: GraphQLBoolean,
      defaultValue: false,
    },

    // Users
    canManageUsers: {
      type: GraphQLBoolean,
      defaultValue: false,
    },
    canManageUserGroups: {
      type: GraphQLBoolean,
      defaultValue: false,
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
