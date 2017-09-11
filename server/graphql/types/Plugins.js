const {
  GraphQLObjectType,
  GraphQLNonNull,
  GraphQLString,
  GraphQLID,
} = require('graphql');
const { DateTime } = require('./CustomTypes');

exports.outputType = new GraphQLObjectType({
  name: 'Plugin',
  fields: {
    _id: {
      type: new GraphQLNonNull(GraphQLID),
      description: 'Mongo ID string.',
    },
    title: {
      type: new GraphQLNonNull(GraphQLString),
      description: 'Title of the plugin.',
    },
    icon: {
      type: new GraphQLObjectType({
        name: 'PluginIcon',
        fields: {
          path: {
            type: new GraphQLNonNull(GraphQLString),
            description: 'The path, from the plugin\'s entry point to the icon file.',
          },
          buffer: {
            type: new GraphQLNonNull(GraphQLString),
            resolve: plug => plug.buffer.toString('base64'),
            description: 'The buffer for the plugin\'s icon.',
          },
        },
      }),
    },
    dateInstalled: {
      type: new GraphQLNonNull(DateTime),
      description: 'The date, in a UNIX timestamp, that the plugin was installed.',
    },
  },
});
