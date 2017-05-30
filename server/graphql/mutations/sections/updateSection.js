const { GraphQLNonNull, GraphQLID } = require('graphql');
const mongoose = require('mongoose');
const { inputType, outputType } = require('../../types/Sections');

const Section = mongoose.model('Section');

module.exports = {
  type: new GraphQLNonNull(outputType),
  args: {
    _id: {
      name: '_id',
      type: new GraphQLNonNull(GraphQLID),
    },
    data: {
      name: 'data',
      type: new GraphQLNonNull(inputType),
    },
  },
  async resolve(root, { _id, data }) {
    const { perms } = root;
    if (!perms.sections.canEditSections) throw new Error('You do not have permission to edit Sections.');
    if (!await Section.findById(_id)) throw new Error('There is no Section with this ID');

    root.events.emit('pre-update-section', { _id, data });

    const updatedSection = await Section.findByIdAndUpdate(_id, data, { new: true });
    if (!updatedSection) throw new Error('Error updating Section');

    root.socketEvent('update-section', updatedSection);
    root.events.emit('post-update-section', updatedSection);
    return updatedSection;
  },
};
