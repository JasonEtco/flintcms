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

    req.login(savedUser, (err) => {
      if (!err) {
        res.status(200).json({ success: true });
      } else {
        throw new Error(err);
      }
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
    const user = await User.findOne({ token }).exec();
    if (!user) throw new Error('Cannot find user');

    user.password = await user.generateHash(password);
    user.token = undefined;

    const savedUser = await user.save();
    if (!savedUser) throw new Error('Could not save the User');

    req.login(user, (err) => {
      if (!err) {
        res.status(200).json({ success: true });
      } else {
        throw new Error(err);
      }
    });
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

  return router;
};
