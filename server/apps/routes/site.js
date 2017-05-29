const mongoose = require('mongoose');
const express = require('express');

const router = express.Router();
const Site = mongoose.model('Site');

router.get('/site', (req, res) => {
  Site.findOne().select('siteLogo')
    .then(site => res.status(200).json(site))
    .catch(err => new Error(err));
});

module.exports = router;
