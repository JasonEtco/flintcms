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
  resolve(root, params, options) {
    const projection = getProjection(options.fieldASTs[0]);

    return SectionModel
      .findById(params.id)
      .select(projection)
      .exec();
  },
};
