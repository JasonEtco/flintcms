const { GraphQLID, GraphQLString } = require('graphql');
const mongoose = require('mongoose');
const { outputType } = require('../../types/Entries');
const getProjection = require('../../get-projection');
const getUserPermissions = require('../../../utils/getUserPermissions');

const Entry = mongoose.model('Entry');

module.exports = {
  type: outputType,
  args: {
    _id: {
      name: '_id',
      type: GraphQLID,
    },
    slug: {
      name: 'slug',
      type: GraphQLString,
    },
    status: {
      name: 'slug',
      type: GraphQLString,
    },
  },
  async resolve(root, args, ctx, ast) {
    const projection = getProjection(ast);

    if (ctx !== undefined && ctx.user !== undefined) {
      const perms = await getUserPermissions(ctx.user._id);

      if (!perms.entries.canSeeDrafts) {
        return Entry
          .findOne(Object.assign({}, args, { status: 'live' }))
          .select(projection)
          .exec();
      }
    }

    return Entry
      .findOne(args)
      .select(projection)
      .exec();
  },
};
