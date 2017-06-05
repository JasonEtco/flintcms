const express = require('express');
const passport = require('passport');
const mongoose = require('mongoose');

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

if (global.FlintSettings.signupRoute) {
  router.post(global.FlintSettings.signupRoute, publicMiddleware, passport.authenticate('local-signup'));
}

if (global.FlintSettings.loginRoute) {
  router.post(global.FlintSettings.loginRoute, passport.authenticate('local-login'));
}

module.exports = router;
