
const { fourOhFourHandler,
        noTemplateHandler,
        noHomepageHandler,
        noHtmlHandler }
        = require('./error-handlers');

/**
 * Handles compilation errors
 * like when a template or page does not exist
 * @param {object} req - Request object
 * @param {object} res - Response object
 * @param {String} type - Type of error or a compiled HTML string
 * @param {String} [template] - Template that the error happened with
 */
function handleCompileErrorRoutes(req, res, type, template) {
  switch (type) {
    case 'no-html':
      return noHtmlHandler(req, res, template);
      break;
    case 'no-template':
      return noTemplateHandler(req, res, template);
      break;
    case 'no-homepage':
      return noHomepageHandler(req, res, template);
      break;
    case 'no-exist':
      return fourOhFourHandler(req, res, template);
      break;
    default:
      res.set('Cache-Control', 'public, max-age=1200, s-maxage=3200');
      return res.send(type);
  }
}

module.exports = handleCompileErrorRoutes;
