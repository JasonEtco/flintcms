const {
  GraphQLList,
  GraphQLID,
  GraphQLNonNull,
} = require('graphql');
const { Types } = require('mongoose');

const SectionType = require('../../types/Sections');
const getProjection = require('../../get-projection');
const SectionModel = require('../../../models/SectionModel');

module.exports = {
  type: SectionType,
  args: {
    _id: {
      name: '_id',
      type: new GraphQLNonNull(GraphQLID),
    },
  },
  resolve(root, args, ctx, ast) {
    const projection = getProjection(ast);

    return SectionModel
      .findById(args.id)
      .select(projection)
      .exec();
  },
};
