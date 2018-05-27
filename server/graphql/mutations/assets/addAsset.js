const { GraphQLNonNull } = require('graphql')
const mongoose = require('mongoose')
const { inputType, outputType } = require('../../types/Assets')

const Asset = mongoose.model('Asset')

module.exports = {
  type: new GraphQLNonNull(outputType),
  args: {
    data: {
      name: 'data',
      type: new GraphQLNonNull(inputType)
    }
  },
  async resolve ({ io, perms, events, socketEvent }, args) {
    if (perms && !perms.assets.canAddAssets) throw new Error('You do not have permission to add new assets.')

    const newAsset = new Asset(args.data)
    if (events) events.emit('pre-new-asset', newAsset)

    const savedAsset = await newAsset.save()

    /* istanbul ignore if */
    if (!savedAsset) throw new Error('There was a problem saving the asset.')

    if (events) events.emit('post-new-asset', savedAsset)
    if (socketEvent) socketEvent('new-asset', savedAsset)
    return savedAsset
  }
}
