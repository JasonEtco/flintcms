const {
  GraphQLID,
  GraphQLNonNull,
} = require('graphql');
const mongoose = require('mongoose');

const FieldType = require('../../types/Field');
const getProjection = require('../../get-projection');

const Field = mongoose.model('Field');

module.exports = {
  type: FieldType,
  args: {
    _id: {
      name: '_id',
      type: new GraphQLNonNull(GraphQLID),
    },
  },
  resolve(root, params, options) {
    const projection = getProjection(options.fieldASTs[0]);

    return Field
      .findById(params.id)
      .select(projection)
      .exec();
  },
};
