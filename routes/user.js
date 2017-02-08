const express = require('express');
const mongoose = require('mongoose');
const h = require('../utils/helpers');

const User = mongoose.model('User');

const router = express.Router();

router.get('/admin/api/user', h.loggedIn, (req, res) => {
  User.findById(req.user.id, '-password')
    .then(user => res.status(200).json(user))
    .catch(err => console.log(err));
});

module.exports = router;
