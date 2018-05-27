const { GraphQLNonNull } = require('graphql')
const mongoose = require('mongoose')
const { inputType, outputType } = require('../../types/Site')

const Site = mongoose.model('Site')

module.exports = {
  type: new GraphQLNonNull(outputType),
  args: {
    data: {
      name: 'data',
      type: new GraphQLNonNull(inputType)
    }
  },
  async resolve ({ events, perms, socketEvent }, { data }) {
    if (!perms.site.canManageSite) throw new Error('You do not have permission to manage site configuration.')

    events.emit('pre-update-site', data)

    const updatedSite = await Site.findOneAndUpdate({}, data, { new: true })

    /* istanbul ignore if */
    if (!updatedSite) throw new Error('Error updating site configuration')

    socketEvent('update-site', updatedSite)

    events.emit('post-update-site', updatedSite)
    return updatedSite
  }
}
