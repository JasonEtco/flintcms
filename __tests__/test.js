const mongoose = require('mongoose');

function clearDB(done) {
  for (const i in mongoose.connection.collections) {
    mongoose.connection.collections[i].remove(() => {});
  }
  return done();
}

beforeAll((done) => {
  if (mongoose.connection.readyState === 0) {
    return mongoose.connect('mongodb://localhost/flintTesting', (err) => {
      if (err) {
        throw err;
      }
      return clearDB(done);
    });
  }

  return clearDB(done);
});

afterAll((done) => {
  mongoose.disconnect();
  return done();
});
