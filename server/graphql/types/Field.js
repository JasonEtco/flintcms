const { GraphQLObjectType, GraphQLNonNull, GraphQLString, GraphQLID } = require('graphql');

module.exports = new GraphQLObjectType({
  name: 'Field',
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
    instructions: {
      type: GraphQLString,
    },
    type: {
      type: GraphQLString,
    },
    dateCreated: {
      type: GraphQLString,
    },
  },
});
