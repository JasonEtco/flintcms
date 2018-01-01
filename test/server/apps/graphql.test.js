const mongoose = require('mongoose');
const common = require('./common');

describe('GraphQL API', () => {
  beforeAll(common.before);

  common.importTest('Users', './types/users.test');
  common.importTest('Entries', './types/entries.test');
  common.importTest('Sections', './types/sections.test');
  common.importTest('Pages', './types/pages.test');
  common.importTest('Fields', './types/fields.test');
  common.importTest('UserGroups', './types/usergroups.test');
  common.importTest('Site', './types/site.test');
  common.importTest('Assets', './types/assets.test');

  afterAll((done) => {
    mongoose.disconnect();
    done();
  });
});
