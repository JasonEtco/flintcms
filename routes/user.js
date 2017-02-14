const express = require('express');
const mongoose = require('mongoose');
const h = require('../utils/helpers');

const User = mongoose.model('User');

const router = express.Router();

router.get('/admin/api/user', h.loggedIn, (req, res) => {
  User.findById(req.user._id, '-password')
    .then(user => res.status(200).json(user))
    .catch(err => new Error(err));
});

router.get('/admin/api/users', h.loggedIn, (req, res) => {
  User.find().select('-password')
    .then(users => res.status(200).json(users))
    .catch(err => new Error(err));
});

module.exports = router;
