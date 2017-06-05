const compile = require('./compile');
const path = require('path');

const fourOhFour = path.join(global.FLINT.templatePath, '404');

module.exports = async (res) => {
  const compiled = await compile(fourOhFour);
  res.status(404).send(compiled);
};
