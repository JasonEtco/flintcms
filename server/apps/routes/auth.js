const express = require('express');
const passport = require('passport');
const mongoose = require('mongoose');

const User = mongoose.model('User');

const router = express.Router();

const strategyOptions = {
  usernameField: 'email',
  passwordField: 'password',
  passReqToCallback: true,
  failureRedirect: '/admin/login',
  successRedicect: '/admin',
};

router.post('/signup', passport.authenticate('local-signup', strategyOptions));

router.post('/login', passport.authenticate('local-login', strategyOptions), (req, res) => {
  res.redirect('/admin');
});

router.get('/verify', async (req, res) => {
  const token = req.query.t;
  const user = await User.findOne({ token });
  if (!user) res.redirect('/admin');
  res.redirect(`/admin/sp/${token}`);
});

router.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/');
});


module.exports = router;
