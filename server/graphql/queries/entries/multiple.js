const { GraphQLList, GraphQLString } = require('graphql');
const mongoose = require('mongoose');
const { outputType } = require('../../types/Entries');
const getProjection = require('../../get-projection');
const getUserPermissions = require('../../../utils/getUserPermissions');

const Entry = mongoose.model('Entry');


module.exports = {
  type: new GraphQLList(outputType),
  args: {
    status: {
      name: 'status',
      type: GraphQLString,
    },
  },
  async resolve(root, args, ctx, ast) {
    const projection = getProjection(ast);
    const perms = await getUserPermissions(ctx.user._id);

    if (!perms.canSeeDrafts) {
      return Entry
        .find({ status: 'live' })
        .select(projection)
        .exec();
    }

    return Entry
      .find(args)
      .select(projection)
      .exec();
  },
};
