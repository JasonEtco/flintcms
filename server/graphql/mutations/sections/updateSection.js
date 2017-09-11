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
  async resolve({ events, perms, socketEvent }, { _id, data }) {
    if (!perms.sections.canEditSections) throw new Error('You do not have permission to edit Sections.');
    if (!await Section.findById(_id)) throw new Error('There is no Section with this ID');

    events.emit('pre-update-section', { _id, data });

    const updatedSection = await Section.findByIdAndUpdate(_id, data, { new: true });

    /* istanbul ignore if */
    if (!updatedSection) throw new Error('Error updating Section');

    socketEvent('update-section', updatedSection);
    events.emit('post-update-section', updatedSection);
    return updatedSection;
  },
};
