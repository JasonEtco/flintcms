const {
  GraphQLObjectType,
  GraphQLNonNull,
  GraphQLString,
  GraphQLID,
  GraphQLInt,
  GraphQLInputObjectType,
  GraphQLBuffer,
} = require('graphql');
const { DateTime } = require('./CustomTypes');

exports.file = new GraphQLInputObjectType({
  name: 'File',
  description: 'A file uploaded via multipart/form-data',
  fields: () => ({
    fieldname: {
      type: new GraphQLNonNull(GraphQLString),
      description: 'The fieldname used to POST this file.',
    },
    originalname: {
      type: new GraphQLNonNull(GraphQLString),
      description: 'The original file name.',
    },
    buffer: {
      type: new GraphQLNonNull(GraphQLBuffer),
      description: 'The file buffered in memory',
    },
  }),
});

exports.outputType = new GraphQLObjectType({
  name: 'Asset',
  fields: {
    _id: {
      type: new GraphQLNonNull(GraphQLID),
      description: 'Mongo ID string.',
    },
    title: {
      type: new GraphQLNonNull(GraphQLString),
      description: 'Title of the asset.',
    },
    extension: {
      type: new GraphQLNonNull(GraphQLString),
      description: 'File extension of the asset.',
    },
    filename: {
      type: new GraphQLNonNull(GraphQLString),
      description: 'The original filename of the asset (in the local file system).',
    },
    dateCreated: {
      type: new GraphQLNonNull(DateTime),
    },
    width: {
      type: new GraphQLNonNull(GraphQLInt),
      description: 'The width, in pixels, of the asset.',
    },
    height: {
      type: new GraphQLNonNull(GraphQLInt),
      description: 'The height, in pixels, of the asset.',
    },
    size: {
      type: new GraphQLNonNull(GraphQLInt),
      description: 'The file size, in bytes, of the asset.',
    },
    mimetype: {
      type: new GraphQLNonNull(GraphQLString),
      description: 'The mimetype of the asset.',
    },
  },
});

exports.inputType = new GraphQLInputObjectType({
  name: 'AssetInput',
  fields: {
    title: {
      type: GraphQLString,
      description: 'Title of the asset.',
    },
    filename: {
      type: GraphQLString,
      description: 'The original filename of the asset (in the local file system).',
    },
    mimetype: {
      type: GraphQLString,
      description: 'The mimetype of the asset.',
    },
    size: {
      type: GraphQLInt,
      description: 'The file size, in bytes, of the asset.',
    },
    width: {
      type: GraphQLInt,
      description: 'The width, in pixels, of the asset.',
    },
    height: {
      type: GraphQLInt,
      description: 'The height, in pixels, of the asset.',
    },
  },
});
