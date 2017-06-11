const fourOhFourHandler = require('./fourOhFourHandler');

/**
 * Handles compilation errors
 * like when a template or page does not exist
 * @param {object} req - Request object
 * @param {object} res - Response object
 * @param {String} type - Type of error
 * @param {String} [template] - Template that the error happened with
 */
function handleCompileErrorRoutes(req, res, type, template) {
  switch (type) {
    case 'no-html':
    case 'no-template':
    case 'no-homepage': {
      const r = type;
      const p = req.originalUrl;
      const t = template;
      return res.redirect(`/admin/error?r=${r}&p=${p}&t=${t}`);
    }
    case 'no-exist':
      return fourOhFourHandler(req, res);
    default:
      return res.send(type);
  }
}

module.exports = handleCompileErrorRoutes;
