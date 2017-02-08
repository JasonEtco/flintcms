const helpers = {
  loggedIn(req, res, next) {
    if (req.user !== undefined) {
      next();
    } else {
      res.status(401).json({ redirect: '/admin/login' });
    }
  },
  slugify(str) {
    return str
      .toLowerCase()
      .replace(/^\s+|\s+$/g, '')   // Trim leading/trailing whitespace
      .replace(/[-\s]+/g, '-')     // Replace spaces with dashes
      .replace(/[^a-z0-9-]/g, '')  // Remove disallowed symbols
      .replace(/--+/g, '-');
  },
};

module.exports = helpers;
