const {
  GraphQLNonNull,
} = require('graphql');
const mongoose = require('mongoose');
const { inputType, outputType } = require('../../types/Assets');

const Asset = mongoose.model('Asset');

module.exports = {
  type: new GraphQLNonNull(outputType),
  args: {
    data: {
      name: 'data',
      type: new GraphQLNonNull(inputType),
    },
  },
  async resolve(root, args) {
    const newAsset = new Asset();

    const { title, filename, mimetype, size, width, height } = args.data;

    newAsset.title = title;
    newAsset.filename = filename;
    newAsset.filesize = size;
    newAsset.width = width;
    newAsset.height = height;
    newAsset.mimetype = mimetype;

    const savedAsset = await newAsset.save();

    if (!savedAsset) throw new Error('There was a problem saving the asset.');

    root.io.emit('new-asset', savedAsset);
    return savedAsset;
  },
};
