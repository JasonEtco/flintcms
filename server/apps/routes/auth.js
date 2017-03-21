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

router.post('/signup', passport.authenticate('local-signup', strategyOptions));

router.post('/login', passport.authenticate('local-login', strategyOptions), (req, res) => {
  res.redirect('/admin');
});

router.get('/logout', (req, res) => {
  req.logout();
  req.session.destroy();
  res.redirect('/');
});

module.exports = router;
