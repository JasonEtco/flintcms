const helpers = {
  loggedIn(req, res, next) {
    console.log(req.user);
    if (req.user !== undefined) {
      next();
    } else {
      res.json({ status: 401, redirect: '/admin/login' });
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
