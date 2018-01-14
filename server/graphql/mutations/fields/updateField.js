const { GraphQLNonNull, GraphQLID } = require('graphql')
const mongoose = require('mongoose')
const { inputType, outputType } = require('../../types/Fields')

const Field = mongoose.model('Field')

module.exports = {
  type: new GraphQLNonNull(outputType),
  args: {
    _id: {
      name: '_id',
      type: new GraphQLNonNull(GraphQLID)
    },
    data: {
      name: 'data',
      type: new GraphQLNonNull(inputType)
    }
  },
  async resolve ({ events, perms, socketEvent }, { _id, data }) {
    const foundField = await Field.findById(_id).lean().exec()
    if (!foundField) throw new Error('There is no Field with this ID')

    if (!perms.fields.canEditFields) throw new Error('You do not have permission to edit fields.')

    events.emit('pre-update-field', { _id, data })

    const updatedField = await Field.findByIdAndUpdate(_id, data, { new: true })

    /* istanbul ignore if */
    if (!updatedField) throw new Error('Error updating Field')

    socketEvent('update-field', updatedField)

    events.emit('post-update-field', updatedField)
    return updatedField
  }
}
