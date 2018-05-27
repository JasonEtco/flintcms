const { GraphQLList } = require('graphql')
const mongoose = require('mongoose')
const { outputType } = require('../../types/Pages')
const getProjection = require('../../get-projection')

const Page = mongoose.model('Page')

module.exports = {
  type: new GraphQLList(outputType),
  args: {},
  resolve (root, args, ctx, ast) {
    const projection = getProjection(ast)

    return Page
      .find()
      .sort({ dateCreated: 1 })
      .select(projection)
      .exec()
  }
}
