const { GraphQLID, GraphQLString } = require('graphql');
const mongoose = require('mongoose');
const { outputType } = require('../../types/Entries');
const getProjection = require('../../get-projection');

const Entry = mongoose.model('Entry');
const Section = mongoose.model('Section');

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
    sectionSlug: {
      name: 'sectionSlug',
      type: GraphQLString,
    },
  },
  async resolve(root, args, ctx, ast) {
    const isAUser = !!ctx && ctx.user !== undefined;
    const projection = getProjection(ast);

    const fargs = Object.assign({}, args);

    if (args.status) {
      if (isAUser && root.perms) {
        fargs.status = !root.perms.entries.canSeeDrafts ? 'live' : args.status;
      }
    }

    if (args.sectionSlug) {
      const section = await Section.findOne({ slug: args.sectionSlug }).select('_id').lean().exec();
      if (!section) throw new Error('That section does not exist.');
      fargs.section = section._id;
      delete fargs.sectionSlug;
    }
    console.log(await Entry.find().exec());
    return Entry
      .findOne(fargs)
      .populate('author')
      .select(projection)
      .exec();
  },
};
