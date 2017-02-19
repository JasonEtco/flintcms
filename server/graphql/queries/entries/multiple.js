const {
  GraphQLList,
} = require('graphql');

const mongoose = require('mongoose');

const Entry = mongoose.model('Entry');

const entryType = require('../../types/Entries');
const getProjection = require('../../get-projection');

module.exports = {
  type: new GraphQLList(entryType),
  args: {},
  resolve(root, args, ctx, ast) {
    const projection = getProjection(ast);

    return Entry
      .find()
      .select(projection)
      .exec();
  },
};
