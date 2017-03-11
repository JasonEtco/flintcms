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
  async resolve(root, args) {
    const { title } = args.data;
    if (!title) throw new Error('You must include a title.');

    const slug = h.slugify(title);
    if (await Field.findOne({ slug })) throw new Error('There is already a field with that slug.');

    const newField = new Field(args.data);
    const savedField = await newField.save();

    const socket = root.io.sockets.connected[root.req.body.socket];
    socket.broadcast.emit('new-field', savedField);

    return savedField;
  },
};
