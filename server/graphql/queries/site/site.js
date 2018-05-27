const mongoose = require('mongoose')
const { outputType } = require('../../types/Site')
const getProjection = require('../../get-projection')

const Site = mongoose.model('Site')

module.exports = {
  type: outputType,
  args: {},
  resolve (root, args, ctx, ast) {
    const projection = getProjection(ast)

    return Site
      .findOne()
      .select(projection)
      .lean()
      .exec()
  }
}
