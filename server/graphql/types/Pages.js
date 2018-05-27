const { GraphQLInputObjectType, GraphQLObjectType, GraphQLBoolean, GraphQLNonNull, GraphQLString, GraphQLID, GraphQLList } = require('graphql')
const { DateTime, FieldType } = require('./CustomTypes')

const outputType = new GraphQLObjectType({
  name: 'Pages',
  fields: {
    _id: {
      type: new GraphQLNonNull(GraphQLID),
      description: 'Mongo ID string.'
    },
    title: {
      type: new GraphQLNonNull(GraphQLString),
      description: 'Title of the page.'
    },
    slug: {
      type: new GraphQLNonNull(GraphQLString),
      descriptions: 'The slug, a slugified version of a title, of the page.'
    },
    handle: {
      type: new GraphQLNonNull(GraphQLString),
      descriptions: 'The handle, a camelcase version of a title, of the page.'
    },
    fieldLayout: {
      type: new GraphQLList(new GraphQLNonNull(GraphQLID)),
      description: '`_id`s of fields'
    },
    fields: {
      type: new GraphQLList(FieldType.outputType),
      description: 'A list of the fields used in the entry.'
    },
    dateCreated: {
      type: new GraphQLNonNull(DateTime),
      description: 'Date Created'
    },
    template: {
      type: new GraphQLNonNull(GraphQLString),
      description: 'A path from the root of the `templates` directory to what template this page uses.'
    },
    homepage: {
      type: new GraphQLNonNull(GraphQLBoolean),
      description: 'Is this page the homepage of your website.'
    },
    route: {
      type: new GraphQLNonNull(GraphQLString),
      description: 'How the URL to this page should look.'
    }
  }
})

const inputType = new GraphQLInputObjectType({
  name: 'PagesInput',
  fields: {
    title: {
      type: new GraphQLNonNull(GraphQLString),
      description: 'Title of the section.'
    },
    template: {
      type: GraphQLString,
      description: 'A path from the root of the `templates` directory to what template this page uses.'
    },
    fieldLayout: {
      type: new GraphQLList(new GraphQLNonNull(GraphQLID)),
      description: '`_id`s of fields'
    },
    fields: {
      type: new GraphQLList(FieldType.inputType),
      description: 'A list of the fields used in the page.'
    },
    dateCreated: {
      type: DateTime,
      description: 'The date that the page was created.'
    },
    homepage: {
      type: GraphQLBoolean,
      description: 'Is this page the homepage of your website.',
      defaultValue: false
    },
    route: {
      type: GraphQLString,
      description: 'How the URL to this page should look.'
    }
  }
})

module.exports = {
  outputType,
  inputType
}
