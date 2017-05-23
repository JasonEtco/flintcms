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
    },
    name: {
      type: new GraphQLNonNull(GraphQLString),
    },
    icon: {
      type: new GraphQLObjectType({
        name: 'PluginIcon',
        fields: {
          path: { type: new GraphQLNonNull(GraphQLString) },
          buffer: {
            type: new GraphQLNonNull(GraphQLString),
            resolve(plug) {
              return plug.buffer.toString('base64');
            },
          },
        },
      }),
    },
    dateInstalled: {
      type: new GraphQLNonNull(DateTime),
    },
  },
});
