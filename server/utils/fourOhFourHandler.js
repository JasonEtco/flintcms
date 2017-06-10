const compile = require('./compile');

module.exports = async (res) => {
  const compiled = await compile('404');
  res.status(404).send(compiled);
};
