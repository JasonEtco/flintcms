const mongoose = require('mongoose');
const mocks = require('./mocks');

function processArray(array) {
  return array.reduce(p => p, Promise.resolve());
}

function wipeDB(array) {
  return array.map(async (collection) => {
    const Model = mongoose.model(collection);
    return Promise.all([
      await Model.remove(),
      await Model.collection.dropIndexes(),
    ]);
  });
}

module.exports = async () => {
  const collections = [
    { model: 'Plugin', mocks: mocks.plugins },
    { model: 'UserGroup', mocks: mocks.usergroups },
    { model: 'User', mocks: mocks.users },
    { model: 'Section', mocks: mocks.sections },
    { model: 'Entry', mocks: mocks.entries },
    { model: 'Field', mocks: mocks.fields },
    { model: 'Page', mocks: mocks.pages },
    { model: 'Site', mocks: mocks.site },
    { model: 'Asset', mocks: mocks.assets },
  ];

  const addModel = async (modelName) => {
    const { mocks: mockData } = collections.find(obj => obj.model === modelName);
    const Model = mongoose.model(modelName);
    const done = await Model.create(mockData);
    return done;
  };

  return processArray([
    await wipeDB(collections.map(c => c.model)),
    await Promise.all([
      await addModel('Field'),
      await addModel('UserGroup'),
      await addModel('Section'),
      await addModel('Entry'),
      await addModel('Page'),
      await addModel('Asset'),
      await addModel('Site'),
      await addModel('Plugin'),
    ]),
    await addModel('User'),
  ]);
};
