const { GraphQLObjectType, GraphQLNonNull, GraphQLString, GraphQLID } = require('graphql');

module.exports = new GraphQLObjectType({
  name: 'User',
  fields: {
    _id: {
      type: new GraphQLNonNull(GraphQLID),
    },
    username: {
      type: GraphQLString,
    },
    dateCreated: {
      type: GraphQLString,
    },
  },
});
