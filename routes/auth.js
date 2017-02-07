const express = require('express');
const passport = require('passport');

const router = express.Router();

router.post('/admin/signup', (req, res, next) => {
  passport.authenticate('local-signup', (err, user) => {
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    if (err) res.status(200).json({ message: err });

    if (user === Object(user)) {
      req.session.user = { _id: user.id };
      res.status(200).json({ success: true });
    }

    res.status(200).json({ message: 'An error has occurred.' });
  })(req, res, next);
});

router.post('/admin/login', (req, res) => {
  passport.authenticate('local-login', {
    successRedirect: '/',
    failureRedirect: '/admin/login',
    failureFlash: true,
  }, res.send('Success!'));
});
