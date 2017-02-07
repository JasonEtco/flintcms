const express = require('express');
const h = require('../utils/helpers');

const router = express.Router();

router.get('/admin/api/user', h.loggedIn, (req, res) => {
  res.status(200).json({ message: 'it worked!' });
});

module.exports = router;
