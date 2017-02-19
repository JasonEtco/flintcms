const {
  GraphQLID,
  GraphQLNonNull,
} = require('graphql');
const mongoose = require('mongoose');

const UserType = require('../../types/User');
const getProjection = require('../../get-projection');

const User = mongoose.model('User');

module.exports = {
  type: UserType,
  args: {
    _id: {
      name: '_id',
      type: new GraphQLNonNull(GraphQLID),
    },
  },
  resolve(root, params, options) {
    const projection = getProjection(options.fieldASTs[0]);

    return User
      .findById(params.id)
      .select(projection)
      .exec();
  },
};
