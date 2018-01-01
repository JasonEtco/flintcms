const mongoose = require('mongoose');
const common = require('./common');

describe('GraphQL API', () => {
  beforeAll(common.before);

  common.importTest('Users', './types/users');
  common.importTest('Entries', './types/entries');
  common.importTest('Sections', './types/sections');
  common.importTest('Pages', './types/pages');
  common.importTest('Fields', './types/fields');
  common.importTest('UserGroups', './types/usergroups');
  common.importTest('Site', './types/site');
  common.importTest('Assets', './types/assets');

  afterAll((done) => {
    mongoose.disconnect();
    done();
  });
});
