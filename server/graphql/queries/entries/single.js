const {
  GraphQLID,
  GraphQLString,
} = require('graphql');
const mongoose = require('mongoose');
const { outputType } = require('../../types/Entries');
const getProjection = require('../../get-projection');

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
  },
  resolve(root, args, ctx, ast) {
    const projection = getProjection(ast);

    return Entry
      .findOne(args)
      .select(projection)
      .exec();
  },
};
