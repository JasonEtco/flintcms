const { GraphQLList, GraphQLString } = require('graphql');
const mongoose = require('mongoose');
const { outputType } = require('../../types/Entries');
const getProjection = require('../../get-projection');

const Entry = mongoose.model('Entry');
const Section = mongoose.model('Section');

module.exports = {
  type: new GraphQLList(outputType),
  args: {
    status: {
      name: 'status',
      type: GraphQLString,
    },
    sectionSlug: {
      name: 'sectionSlug',
      type: GraphQLString,
    },
  },
  async resolve(root, args, ctx, ast) {
    const isAUser = ctx !== undefined && ctx.user !== undefined;
    const projection = getProjection(ast);

    const fargs = {};

    if (isAUser && root.perms && !root.perms.entries.canSeeDrafts) {
      fargs.status = 'live';
    } else if (args.status) {
      fargs.status = args.status;
    }

    if (args.sectionSlug) {
      const { _id } = await Section.findOne({ slug: args.sectionSlug }).select('_id').lean().exec();
      fargs.section = _id;
    }

    return Entry
      .find(fargs)
      .sort({ dateCreated: 1 })
      .populate('author')
      .select(projection)
      .exec();
  },
};
