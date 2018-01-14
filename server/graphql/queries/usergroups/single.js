const { GraphQLID } = require('graphql')
const mongoose = require('mongoose')
const { outputType } = require('../../types/UserGroups')
const getProjection = require('../../get-projection')

const UserGroup = mongoose.model('UserGroup')

module.exports = {
  type: outputType,
  args: {
    _id: {
      name: '_id',
      type: GraphQLID
    }
  },
  resolve (root, args, ctx, ast) {
    const projection = getProjection(ast)

    return UserGroup
      .findOne(args)
      .select(projection)
      .exec()
  }
}
