const { GraphQLObjectType, GraphQLNonNull, GraphQLString, GraphQLID } = require('graphql');

module.exports = new GraphQLObjectType({
  name: 'Entries',
  fields: {
    _id: {
      type: new GraphQLNonNull(GraphQLID),
    },
    title: {
      type: GraphQLString,
    },
    section: {
      type: new GraphQLNonNull(GraphQLID),
    },
    slug: {
      type: GraphQLString,
    },
    author: {
      type: new GraphQLNonNull(GraphQLID),
    },
  },
});
