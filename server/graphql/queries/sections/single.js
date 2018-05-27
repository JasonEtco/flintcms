const { GraphQLID, GraphQLString } = require('graphql')
const mongoose = require('mongoose')
const { outputType } = require('../../types/Sections')
const getProjection = require('../../get-projection')

const Section = mongoose.model('Section')

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

    return Section
      .findOne(args)
      .select(projection)
      .exec()
  }
}
