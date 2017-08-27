const mongoose = require('mongoose');
const mocks = require('./__mocks__');

function processArray(array) {
  return array.reduce(p => p, Promise.resolve());
}

module.exports = async () => {
  const collections = [
    { model: 'UserGroup', mocks: mocks.usergroups },
    { model: 'User', mocks: mocks.users },
    { model: 'Section', mocks: mocks.sections },
    { model: 'Entry', mocks: mocks.entries },
    { model: 'Field', mocks: mocks.fields },
    { model: 'Page', mocks: mocks.pages },
  ];

  const addModel = async (modelName) => {
    const { mocks: mockData } = collections.find(obj => obj.model === modelName);
    const Model = mongoose.model(modelName);
    const done = await Model.create(mockData);
    return done;
  };

  return processArray([
    await Promise.all(collections.map(async (collection) => {
      const Model = mongoose.model(collection.model);
      const done = await Model.remove();
      return done;
    })),
    await Promise.all([
      await addModel('Field'),
      await addModel('UserGroup'),
      await addModel('Section'),
      await addModel('Entry'),
      await addModel('Page'),
    ]),
    await addModel('User'),
  ]);
};
