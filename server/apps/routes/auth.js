const express = require('express');
const passport = require('passport');
const mongoose = require('mongoose');
const randtoken = require('rand-token');
const sendEmail = require('../../utils/emails/sendEmail');

const User = mongoose.model('User');
const UserGroup = mongoose.model('UserGroup');
const router = express.Router();

const strategyOptions = { passReqToCallback: true };

module.exports = () => {
  router.post('/signup', passport.authenticate('local-signup', strategyOptions));

  router.post('/login', passport.authenticate('local-login', strategyOptions), (req, res) => {
    res.json({ success: true });
  });

  router.post('/firstuser', async (req, res) => {
    const user = await User.findOne().exec();
    if (user) {
      res.status(200).json({ success: false, message: 'There is already a user in the database.' });
      return;
    }

    const newUser = new User(req.body);
    newUser.password = newUser.generateHash(req.body.password);

    const adminUserGroup = await UserGroup.findOne({ slug: 'admin' }).exec();
    newUser.usergroup = adminUserGroup._id;

    const savedUser = await newUser.save();
    if (!savedUser) throw new Error('Could not save the User');

    req.login(savedUser, () => {
      res.status(200).json({ success: true });
    });
  });

  router.get('/firstinstall', async (req, res) => {
    const foundUser = await User.findOne().exec();
    if (foundUser) {
      res.json({ firstTimeInstall: false });
    } else {
      res.json({ firstTimeInstall: true });
    }
  });

  router.post('/setpassword', async (req, res) => {
    const { token, password } = req.body;

    if (!password) {
      res.status(400).json({ message: 'You must include a password.' });
      return;
    }

    const user = await User.findOne({ token }).exec();
    if (!user) {
      res.status(400).json({ message: 'Cannot find user.' });
      return;
    }

    user.password = await user.generateHash(password);
    user.token = undefined;

    const savedUser = await user.save();
    if (!savedUser) {
      res.status(400).json({ message: 'Could not save the User.' });
      return;
    }

    req.login(user, () => {
      res.status(200).json({ success: true });
    });
  });

  router.post('/forgotpassword', async (req, res) => {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      res.status(400).end('There is no user with that email.');
      return;
    }

    const token = await randtoken.generate(16);
    const data = { token, password: undefined };

    const updatedUser = await User.findByIdAndUpdate(user._id, data, { new: true }).exec();

    if (!updatedUser) {
      res.status(400).end('Error updating user');
      return;
    }

    const name = user.name.first || user.username;

    sendEmail(user.email, 'reset-password', { subject: 'Reset your password', token, name });
    res.status(200).json({ success: true });
  });

  router.get('/verify', async (req, res) => {
    const token = req.query.t;
    const user = await User.findOne({ token });

    if (!user) {
      res.redirect('/admin');
      return;
    }

    res.redirect(`/admin/sp/${token}`);
  });

  router.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/');
  });

  return router;
};
