const {
  GraphQLNonNull,
} = require('graphql');
const mongoose = require('mongoose');
const { inputType, outputType } = require('../../types/Sections');
const h = require('../../../utils/helpers');

const Section = mongoose.model('Section');

module.exports = {
  type: new GraphQLNonNull(outputType),
  args: {
    data: {
      name: 'data',
      type: new GraphQLNonNull(inputType),
    },
  },
  async resolve(root, args) {
    const { fields, title } = args.data;
    if (fields === undefined || fields.length === 0) throw new Error('You must include at least one field.');
    if (!title) throw new Error('You must include a title.');

    const slug = h.slugify(title);
    if (await Section.findOne({ slug })) throw new Error('There is already a section with that slug.');

    const newSection = new Section(args.data);
    const savedSection = await newSection.save();

    const socket = root.io.sockets.connected[root.req.body.socket];
    socket.broadcast.emit('new-section', savedSection);

    return savedSection;
  },
};

