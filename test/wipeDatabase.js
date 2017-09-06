const mongoose = require('mongoose');
const mocks = require('./mocks');
const connectToDatabase = require('../server/utils/database');

module.exports = async () => {
  await connectToDatabase();

  const collections = [
    { model: 'UserGroup', mocks: mocks.usergroups },
    { model: 'User', mocks: mocks.users },
    { model: 'Section', mocks: mocks.sections },
    { model: 'Entry', mocks: mocks.entries },
    { model: 'Field', mocks: mocks.fields },
    { model: 'Page', mocks: mocks.pages },
    { model: 'Site', mocks: mocks.site },
  ];

  await Promise.all(collections.map(async (collection) => {
    const Model = mongoose.model(collection.model);
    return Promise.all([
      await Model.remove(),
      await Model.collection.dropIndexes(),
    ]);
  }));

  return mongoose.disconnect();
};
