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

    const { title, filename, mimetype, size } = args.data;
    const extP = title.split(/[\s.]+/);

    newAsset.title = title;
    newAsset.extension = extP[extP.length - 1];
    newAsset.filename = filename;
    newAsset.filesize = size;
    newAsset.width = 3;
    newAsset.height = 3;
    newAsset.size = 3;
    newAsset.mimetype = mimetype;

    const savedAsset = await newAsset.save();

    if (!savedAsset) throw new Error('There was a problem saving the asset.');

    root.io.emit('new-asset', savedAsset);
    return savedAsset;
  },
};
