const {
  GraphQLNonNull,
} = require('graphql');
const mongoose = require('mongoose');
const { inputType, outputType } = require('../../types/Fields');
const h = require('../../../utils/helpers');

const Field = mongoose.model('Field');

module.exports = {
  type: new GraphQLNonNull(outputType),
  args: {
    data: {
      name: 'data',
      type: new GraphQLNonNull(inputType),
    },
  },
  async resolve(root, params) {
    const { title } = params.data;
    if (!title) throw new Error('You must include a title.');

    const slug = h.slugify(title);
    if (await Field.findOne({ slug })) throw new Error('There is already a field with that slug.');

    const newField = new Field(params.data);

    newField.slug = slug;
    newField.dateCreated = Date.now();

    const savedField = await newField.save();

    root.io.emit('new-field', savedField);
    return savedField;
  },
};
