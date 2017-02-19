const { GraphQLObjectType, GraphQLNonNull, GraphQLString, GraphQLID } = require('graphql');

module.exports = new GraphQLObjectType({
  name: 'Sections',
  fields: {
    _id: {
      type: new GraphQLNonNull(GraphQLID),
    },
    title: {
      type: GraphQLString,
    },
    slug: {
      type: GraphQLString,
    },
  },
});
