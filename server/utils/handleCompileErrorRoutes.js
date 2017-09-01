const fourOhFourHandler = require('./fourOhFourHandler');

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
    case 'no-template':
    case 'no-homepage': {
      const obj = {
        r: type,
        p: req.originalUrl,
      };

      if (template) obj.t = template;

      const queryString = Object.keys(obj).reduce((prev, curr, i) => {
        let queryParam = `${curr}=${obj[curr]}`;
        if (i !== 0) queryParam = `&${queryParam}`;
        return `${prev}${queryParam}`;
      }, '');

      return res.redirect(`/admin/error?${queryString}`);
    }
    case 'no-exist':
      return fourOhFourHandler(req, res);
    default:
      return res.send(type);
  }
}

module.exports = handleCompileErrorRoutes;
