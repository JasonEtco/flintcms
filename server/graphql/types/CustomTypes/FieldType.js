const {
  GraphQLInputObjectType,
  GraphQLObjectType,
  GraphQLNonNull,
  GraphQLString,
  GraphQLID,
} = require('graphql');
const ObjectType = require('./ObjectType');

exports.outputType = new GraphQLObjectType({
  name: 'EntryFields',
  fields: {
    fieldId: {
      type: new GraphQLNonNull(GraphQLID),
    },
    handle: {
      type: GraphQLString,
    },
    value: {
      type: ObjectType,
    },
  },
});

exports.inputType = new GraphQLInputObjectType({
  name: 'EntryFieldsInput',
  fields: {
    fieldId: {
      type: new GraphQLNonNull(GraphQLID),
    },
    handle: {
      type: GraphQLString,
    },
    value: {
      type: ObjectType,
    },
  },
});
