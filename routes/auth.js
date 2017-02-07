const express = require('express');
const passport = require('passport');

const router = express.Router();

const strategyOptions = {
  usernameField: 'username',
  passwordField: 'password',
  passReqToCallback: true,
  failureRedirect: '/admin/login',
  successRedicect: '/admin',
};

router.post('/admin/signup', passport.authenticate('local-signup', strategyOptions));

router.post('/admin/login', passport.authenticate('local-login', strategyOptions), (req, res) => {
  res.redirect('/admin');
});

module.exports = router;
