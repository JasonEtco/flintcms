const express = require('express');
const passport = require('passport');
const mongoose = require('mongoose');
const randtoken = require('rand-token');
const sendEmail = require('../../utils/emails/sendEmail');

const User = mongoose.model('User');
const router = express.Router();

const strategyOptions = { passReqToCallback: true };

router.post('/signup', passport.authenticate('local-signup', strategyOptions));

router.post('/login', passport.authenticate('local-login', strategyOptions), (req, res) => {
  res.json({ success: true });
});

router.post('/setpassword', async (req, res) => {
  const { token, password } = req.body;
  const user = await User.findOne({ token });
  if (!user) throw new Error('Cannot find user');

  user.password = await user.generateHash(password);
  user.token = undefined;

  const savedUser = await user.save();
  if (!savedUser) throw new Error('Could not save the User');

  req.login(savedUser);
  res.status(200).json({ success: true });
});

router.post('/forgotpassword', async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) throw new Error('There is no user with that id.');

  const token = await randtoken.generate(16);
  const data = { token, password: undefined };

  const updatedUser = await User.findByIdAndUpdate(user._id, data, { new: true });
  if (!updatedUser) throw new Error('Error updating user');

  const name = user.name.first || user.username;

  sendEmail(user.email, 'reset-password', { subject: 'Reset your password', token, name });
  res.status(200).json({ success: true });
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
