const mongoose = require('mongoose');
const common = require('./common');

describe('GraphQL API', function () {
  before('Start a server and populates the db', common.before);

  common.importTest('Users', './types/users');
  common.importTest('Entries', './types/entries');
  common.importTest('Sections', './types/sections');
  common.importTest('Pages', './types/pages');
  common.importTest('Fields', './types/fields');
  common.importTest('UserGroups', './types/usergroups');
  common.importTest('Site', './types/site');
  common.importTest('Assets', './types/assets');

  after((done) => {
    mongoose.disconnect();
    done();
  });
});
