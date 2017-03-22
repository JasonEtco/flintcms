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
    section: {
      name: 'section',
      type: GraphQLString,
    },
  },
  async resolve(root, args, ctx, ast) {
    const projection = getProjection(ast);

    if (ctx !== undefined && ctx.user !== undefined) {
      const perms = await getUserPermissions(ctx.user._id);

      if (!perms.entries.canSeeDrafts) {
        return Entry
          .find({ status: 'live' })
          .select(projection)
          .exec();
      }
    }

    if (args.section) {
      const { _id: section } = await Section.findOne({ slug: args.section }).select('_id').lean().exec();
      return Entry
        .find(Object.assign({}, args, { section }))
        .select(projection)
        .exec();
    }

    return Entry
      .find(args)
      .select(projection)
      .exec();
  },
};
