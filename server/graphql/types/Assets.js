const {
  GraphQLObjectType,
  GraphQLNonNull,
  GraphQLString,
  GraphQLID,
  GraphQLInt,
  GraphQLInputObjectType,
} = require('graphql');

exports.outputType = new GraphQLObjectType({
  name: 'Asset',
  fields: {
    _id: {
      type: new GraphQLNonNull(GraphQLID),
    },
    title: {
      type: new GraphQLNonNull(GraphQLString),
    },
    extension: {
      type: new GraphQLNonNull(GraphQLString),
    },
    filename: {
      type: new GraphQLNonNull(GraphQLString),
    },
    dateCreated: {
      type: new GraphQLNonNull(GraphQLString),
    },
    width: {
      type: GraphQLInt,
    },
    height: {
      type: GraphQLInt,
    },
    filesize: {
      type: GraphQLInt,
    },
    mimeType: {
      type: new GraphQLNonNull(GraphQLString),
    },
  },
});

exports.inputType = new GraphQLInputObjectType({
  name: 'AssetInput',
  fields: {
    title: {
      type: GraphQLString,
    },
    filename: {
      type: GraphQLString,
    },
  },
});
