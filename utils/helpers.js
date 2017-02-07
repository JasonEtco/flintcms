const helpers = {
  loggedIn(req, res, next) {
    if (req.user !== undefined) return next();
    res.json({ status: 401, redirect: '/admin/login' });
  },
};

module.exports = helpers;
