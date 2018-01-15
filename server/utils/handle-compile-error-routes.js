const compile = require('./compile');

/**
 * Handles compilation errors
 * like when a template or page does not exist
 * @param {object} req - Request object
 * @param {object} res - Response object
 * @param {String} type - Type of error or a compiled HTML string
 * @param {String} [template] - Template that the error happened with
 */
async function handleCompileErrorRoutes(req, res, type, template) {
  try {
    const compiled = await compile(type, { request: req, template });
    return compiled;
  } catch (e) {
    res.set('Cache-Control', 'public, max-age=1200, s-maxage=3200');
    return res.send(type);
  }
}

module.exports = handleCompileErrorRoutes;
