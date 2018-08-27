const { GraphQLList, GraphQLString } = require('graphql')
const { outputType } = require('../../types/Entry')
const getProjection = require('../../get-projection')

module.exports = {
  type: new GraphQLList(outputType),
  args: {
    status: {
      name: 'status',
      type: GraphQLString
    },
    sectionSlug: {
      name: 'sectionSlug',
      type: GraphQLString
    }
  },
  async resolve (root, args, ctx, ast) {
    const projection = getProjection(ast)

    return root.db.models.Entry
      .find()
      .sort({ dateCreated: 1 })
      .select(projection)
      .exec()
  }
}
