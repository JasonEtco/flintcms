const { GraphQLNonNull, GraphQLID } = require('graphql')
const mongoose = require('mongoose')
const fs = require('fs')
const path = require('path')
const { outputType } = require('../../types/Assets')

const Asset = mongoose.model('Asset')

module.exports = {
  type: outputType,
  args: {
    _id: {
      name: '_id',
      type: new GraphQLNonNull(GraphQLID)
    }
  },
  async resolve ({ events, perms, socketEvent }, { _id }) {
    if (!perms.assets.canDeleteAssets) throw new Error('You do not have permission to delete assets.')

    const foundAsset = await Asset.findById(_id).exec()
    if (!foundAsset) throw new Error('This asset doesn\'t exist.')
    events.emit('pre-delete-asset', foundAsset)

    const removedAsset = await Asset.findByIdAndRemove(_id).exec()

    /* istanbul ignore if */
    if (!removedAsset) throw new Error('Error removing asset')

    const pathToFile = path.join(global.FLINT.publicPath, 'assets', foundAsset.filename)

    try {
      fs.unlinkSync(pathToFile)
    } catch (e) {} // eslint-disable-line

    socketEvent('delete-asset', removedAsset)
    events.emit('post-delete-asset', removedAsset)
    return removedAsset
  }
}
