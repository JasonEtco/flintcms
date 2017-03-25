const { GraphQLNonNull, GraphQLID } = require('graphql');
const mongoose = require('mongoose');
const { outputType } = require('../../types/Fields');
const getProjection = require('../../get-projection');
const emitSocketEvent = require('../../../utils/emitSocketEvent');
const getUserPermissions = require('../../../utils/getUserPermissions');

const Field = mongoose.model('Field');
const Section = mongoose.model('Section');


module.exports = {
  type: outputType,
  args: {
    _id: {
      name: '_id',
      type: new GraphQLNonNull(GraphQLID),
    },
  },
  async resolve(root, { _id }, ctx, ast) {
    const perms = await getUserPermissions(ctx.user._id);
    if (!perms.fields.canAddFields) throw new Error('You do not have permission to create a new Field.');

    const projection = getProjection(ast);
    const removedField = await Field
      .findByIdAndRemove(_id, { select: projection })
      .exec();

    Section.find({ fields: _id })
      .then(sections => sections
      .forEach(sec => Section
      .findByIdAndUpdate(sec._id, { $pull: { fields: _id } }, { new: true })
      .then(updateSection => root.io.emit('update-section', updateSection))));

    if (!removedField) throw new Error('Error removing field');

    emitSocketEvent(root, 'delete-field', removedField);

    return removedField;
  },
};
