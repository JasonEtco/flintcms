const { GraphQLBoolean, GraphQLInputObjectType, GraphQLObjectType, GraphQLNonNull, GraphQLString, GraphQLID } = require('graphql');

const entries = {
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
  canSeeDrafts: {
    type: GraphQLBoolean,
    defaultValue: false,
  },
  canChangeEntryStatus: {
    type: GraphQLBoolean,
    defaultValue: false,
  },
};

const sections = {
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
};

const fields = {
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
};

const users = {
  canManageUsers: {
    type: GraphQLBoolean,
    defaultValue: false,
  },
  canManageUserGroups: {
    type: GraphQLBoolean,
    defaultValue: false,
  },
};

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
    dateCreated: { type: new GraphQLNonNull(GraphQLString) },
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
