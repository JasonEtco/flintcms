const { GraphQLObjectType, GraphQLNonNull, GraphQLString, GraphQLID, GraphQLList } = require('graphql');

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
    fields: {
      type: new GraphQLList(new GraphQLNonNull(GraphQLID)),
      description: '`id`s of fields',
    },
  },
});
