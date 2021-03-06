const { GraphQLNonNull } = require('graphql')
const mongoose = require('mongoose')
const { inputType, outputType } = require('../../types/Fields')
const h = require('../../../utils/helpers')

const Field = mongoose.model('Field')

module.exports = {
  type: new GraphQLNonNull(outputType),
  args: {
    data: {
      name: 'data',
      type: new GraphQLNonNull(inputType)
    }
  },
  async resolve ({ events, perms, socketEvent }, args) {
    if (!perms.fields.canAddFields) throw new Error('You do not have permission to create a new Field.')

    const { title } = args.data
    if (!title) throw new Error('You must include a title.')

    const slug = h.slugify(title)
    if (await Field.findOne({ slug })) throw new Error('There is already a field with that slug.')

    const newField = new Field(args.data)
    events.emit('pre-new-field', newField)

    // Emit new-field event, wait for plugins to affect the new field
    const savedField = await newField.save()

    /* istanbul ignore if */
    if (!savedField) throw new Error('Error adding new field')

    events.emit('post-new-field', savedField)
    socketEvent('new-field', savedField)
    return savedField
  }
}
