const {
  GraphQLNonNull,
} = require('graphql');
const mongoose = require('mongoose');
const { inputType, outputType } = require('../../types/Sections');
const h = require('../../../utils/helpers');
const emitSocketEvent = require('../../../utils/emitSocketEvent');
const getUserPermissions = require('../../../utils/getUserPermissions');

const Section = mongoose.model('Section');

module.exports = {
  type: new GraphQLNonNull(outputType),
  args: {
    data: {
      name: 'data',
      type: new GraphQLNonNull(inputType),
    },
  },
  async resolve(root, args, ctx) {
    const perms = await getUserPermissions(ctx.user._id);
    if (!perms.sections.canAddSections) throw new Error('You do not have permission to create a new Section.');

    const { fields, title } = args.data;
    if (fields === undefined || fields.length === 0) throw new Error('You must include at least one field.');
    if (!title) throw new Error('You must include a title.');

    const slug = h.slugify(title);
    if (await Section.findOne({ slug })) throw new Error('There is already a section with that slug.');

    const newSection = new Section(args.data);
    const savedSection = await newSection.save();

    emitSocketEvent(root, 'new-section', savedSection);

    return savedSection;
  },
};

