const compile = require('./compile');

const fourOhFourHandler = async (req, res) => {
  const compiled = await compile('404', { request: req });
  return res.status(404).send(compiled);
};

const noTemplateHandler = async (req, res, template) => {
  const compiled = await compile('server-missingTemplate', { request: req, template });
  return res.send(compiled);
};

const noHomepageHandler = async (req, res) => {
  const compiled = await compile('server-default-homepage', { request: req });
  return res.send(compiled);
};

const noHtmlHandler = async (req, res, template) => {
  const compiled = await compile('server-noHtml', { request: req, template });
  return res.send(compiled);
};

module.exports = { fourOhFourHandler, noTemplateHandler, noHomepageHandler, noHtmlHandler };
