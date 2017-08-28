const Flint = require('../../../');
const mocks = require('../../mocks');
const populateDB = require('../../populatedb');
const supertest = require('supertest');

exports.importTest = function importTest(name, path) {
  describe(name, function () {
    // eslint-disable-next-line global-require, import/no-dynamic-require
    require(path);
  });
};

exports.before = async function before() {
  this.timeout(15000);
  const flintServer = new Flint({ listen: false });
  const server = await flintServer.startServer();
  global.agent = supertest.agent(server);

  await populateDB();

  return global.agent
    .post('/admin/login')
    .send({ email: mocks.users[0].email, password: 'password' })
    .expect(200);
};
