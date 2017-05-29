const { GraphQLList, GraphQLString } = require('graphql');
const mongoose = require('mongoose');
const { outputType } = require('../../types/Entries');
const getProjection = require('../../get-projection');
const getUserPermissions = require('../../../utils/getUserPermissions');

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

    if (args.status) {
      if (isAUser) {
        const perms = await getUserPermissions(ctx.user._id);
        fargs.status = !perms.entries.canSeeDrafts ? 'live' : args.status;
      } else {
        fargs.status = args.status;
      }
    }

    if (args.sectionSlug) {
      const { _id } = await Section.findOne({ slug: args.sectionSlug }).select('_id').lean().exec();
      fargs.section = _id;
    }

    return Entry
      .find(fargs)
      .populate('author')
      .select(projection)
      .exec();
  },
};
