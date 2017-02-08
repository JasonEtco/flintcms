const express = require('express');
const mongoose = require('mongoose');
const h = require('../utils/helpers');

const Section = mongoose.model('Section');

const router = express.Router();

router.post('/admin/api/section', h.loggedIn, (req, res) => {
  const { title } = req.body;
  const slug = h.slugify(title);

  process.nextTick(() => {
    Section.findOne({ slug }).then((section) => {
      if (section) res.status(409).json({ success: false, message: 'There is already a section with that slug.' });
      const newSection = new Section();

      newSection.title = title;
      newSection.slug = slug;
      newSection.dateCreated = Date.now();

      return newSection.save().then(() => res.status(200).json({ success: true }));
    })
    .catch(err => console.log(err));
  });
});

module.exports = router;
