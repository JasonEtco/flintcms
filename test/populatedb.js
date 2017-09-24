const mongoose = require('mongoose');
const mocks = require('./mocks');

function nexter(obj) {
  return new Promise((resolve, reject) => {
    mongoose.connection.db.listCollections(obj)
      .next((err, collinfo) => {
        if (collinfo) resolve(collinfo);
        else reject(err);
      });
  });
}

async function wipeDB(collections) {
  return collections.map(async ({ model, collection }) => {
    const Model = mongoose.model(model);
    // const collectionExists = await nexter({ name: collection });

    // if (collectionExists) await Model.collection.dropIndexes();
    return Model.remove();
  });
}

const collections = [
  { model: 'Plugin', mocks: mocks.plugins, collection: 'plugins' },
  { model: 'UserGroup', mocks: mocks.usergroups, collection: 'usergroups' },
  { model: 'User', mocks: mocks.users, collection: 'users' },
  { model: 'Section', mocks: mocks.sections, collection: 'sections' },
  { model: 'Entry', mocks: mocks.entries, collection: 'entries' },
  { model: 'Field', mocks: mocks.fields, collection: 'fields' },
  { model: 'Page', mocks: mocks.pages, collection: 'pages' },
  { model: 'Site', mocks: mocks.site, collection: 'sites' },
  { model: 'Asset', mocks: mocks.assets, collection: 'assets' },
];

const addModel = async (modelName) => {
  const { mocks: mockData } = collections.find(obj => obj.model === modelName);
  const Model = mongoose.model(modelName);
  const done = await Model.create(mockData);
  return done;
};

module.exports = async () => {
  await wipeDB(collections);

  await addModel('Field');
  await addModel('UserGroup');
  await addModel('Section');
  await addModel('Entry');
  await addModel('Page');
  await addModel('Asset');
  await addModel('Site');
  await addModel('Plugin');
  return addModel('User');
};
