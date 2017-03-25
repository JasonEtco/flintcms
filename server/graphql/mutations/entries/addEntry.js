const { GraphQLNonNull } = require('graphql');
const mongoose = require('mongoose');
const { inputType, outputType } = require('../../types/Entries');
const h = require('../../../utils/helpers');
const emitSocketEvent = require('../../../utils/emitSocketEvent');
const getUserPermissions = require('../../../utils/getUserPermissions');

const Entry = mongoose.model('Entry');
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
    if (!perms.entries.canAddEntries) throw new Error('You do not have permission to create new Entries');
    if (!perms.entries.canEditLive) throw new Error('You do not have permission to create a live Entry. Change the status to "Draft".');

    const slug = h.slugify(args.data.title);

    if (!await Section.findById(args.data.section)) throw new Error('That section does not exist.');
    if (await Entry.findOne({ slug })) throw new Error('There is already an entry with that slug.');

    const data = await h.reduceToObj(args.data.fields, 'handle', 'value', args.data);

    const newEntry = new Entry(data);
    const savedEntry = await newEntry.save();

    if (!savedEntry) throw new Error('Error adding new entry');

    emitSocketEvent(root, 'new-entry', savedEntry);

    return savedEntry;
  },
};
