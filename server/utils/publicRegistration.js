const express = require('express');
const passport = require('passport');
const mongoose = require('mongoose');
const config = require('../../config');

const router = express.Router();
const Site = mongoose.model('Site');

async function publicMiddleware(req, res, next) {
  const site = await Site.findOne();
  if (site.allowPublicRegistration) {
    next();
  } else {
    res.redirect('/admin/login');
  }
}

if (config.signupRoute) {
  router.post(config.signupRoute, publicMiddleware, passport.authenticate('local-signup'));
}

if (config.loginRoute) {
  router.post(config.loginRoute, passport.authenticate('local-login'));
}

module.exports = router;
