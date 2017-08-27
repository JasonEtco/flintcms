const mongoose = require('mongoose');
const common = require('./common');

describe('GraphQL API', function () {
  before('Start a server and populates the db', common.before);

  common.importTest('Users', './types/users');
  common.importTest('Entries', './types/entries');
  common.importTest('Sections', './types/sections');
  common.importTest('Pages', './types/pages');

  after((done) => {
    mongoose.disconnect();
    done();
  });
});
