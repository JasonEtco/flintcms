const compile = require('./compile');
const path = require('path');

const fourOhFour = path.join(__dirname, '..', '..', 'templates', '404');

module.exports = async (res) => {
  const compiled = await compile(fourOhFour);
  res.status(404).send(compiled);
};
