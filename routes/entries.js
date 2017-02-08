const express = require('express');
const mongoose = require('mongoose');
const h = require('../utils/helpers');

const Entry = mongoose.model('Entry');

const router = express.Router();

router.get('/admin/api/entries', h.loggedIn, (req, res) => {
  Entry.find()
    .then(entries => res.status(200).json(entries))
    .catch(err => console.log(err));
});

module.exports = router;
