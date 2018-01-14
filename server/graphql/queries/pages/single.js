const { GraphQLID, GraphQLString } = require('graphql')
const mongoose = require('mongoose')
const { outputType } = require('../../types/Pages')
const getProjection = require('../../get-projection')

const Page = mongoose.model('Page')

module.exports = {
  type: outputType,
  args: {
    _id: {
      name: '_id',
      type: GraphQLID
    },
    slug: {
      name: 'slug',
      type: GraphQLString
    }
  },
  resolve (root, args, ctx, ast) {
    const projection = getProjection(ast)

    return Page
      .findOne(args)
      .select(projection)
      .exec()
  }
}
