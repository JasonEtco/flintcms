const { GraphQLNonNull, GraphQLID } = require('graphql')
const mongoose = require('mongoose')
const { outputType } = require('../../types/Fields')
const getProjection = require('../../get-projection')

const Field = mongoose.model('Field')
const Section = mongoose.model('Section')

module.exports = {
  type: outputType,
  args: {
    _id: {
      name: '_id',
      type: new GraphQLNonNull(GraphQLID)
    }
  },
  async resolve ({ io, events, perms, socketEvent }, { _id }, ctx, ast) {
    if (!perms.fields.canAddFields) throw new Error('You do not have permission to delete Fields.')

    const foundField = await Field.findById(_id).exec()
    if (!foundField) throw new Error('The field could not be found.')

    events.emit('pre-delete-field', foundField)

    const projection = getProjection(ast)
    const removedField = await Field
      .findByIdAndRemove(_id, { select: projection })
      .exec()

    Section.find({ fields: _id })
      .then(sections => sections
      .forEach(sec => Section
      .findByIdAndUpdate(sec._id, { $pull: { fields: _id } }, { new: true })
      .then(updateSection => io.emit('update-section', updateSection))))

    /* istanbul ignore if */
    if (!removedField) throw new Error('Error removing field')

    events.emit('post-delete-field', removedField)
    socketEvent('delete-field', removedField)
    return removedField
  }
}
