const mongoose = require('mongoose');
const express = require('express');

const User = mongoose.model('User');
const router = express.Router();

router.get('/user', (req, res) => {
  User.findById(req.user._id, '-password')
    .then(user => res.status(200).json(user))
    .catch(err => new Error(err));
});

router.get('/users', (req, res) => {
  User.find().select('-password')
    .then(users => res.status(200).json(users))
    .catch(err => new Error(err));
});

module.exports = router;
