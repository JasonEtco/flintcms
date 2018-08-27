const {
  GraphQLInputObjectType,
  GraphQLObjectType,
  GraphQLNonNull,
  GraphQLString,
  GraphQLID
} = require('graphql')
const DateTime = require('./custom-types/date-time')

const outputType = new GraphQLObjectType({
  name: 'Entry',
  fields: {
    _id: {
      type: new GraphQLNonNull(GraphQLID),
      description: 'Mongo ID string.'
    },
    title: {
      type: GraphQLString,
      description: 'Title of the entry.'
    },
    slug: {
      type: new GraphQLNonNull(GraphQLString),
      descriptions: 'The slug, a slugified version of a title, of the entry.'
    },
    dateCreated: {
      type: new GraphQLNonNull(DateTime)
    }
  }
})

const inputType = new GraphQLInputObjectType({
  name: 'EntryInput',
  fields: {
    title: {
      type: GraphQLString,
      description: 'Title of the entry.'
    },
    dateCreated: {
      type: GraphQLString
    }
  }
})

module.exports = {
  inputType,
  outputType
}
