const express = require('express');
const mongoose = require('mongoose');
const h = require('../utils/helpers');

const Entry = mongoose.model('Entry');
const Section = mongoose.model('Section');

const router = express.Router();

router.get('/admin/api/entries', h.loggedIn, (req, res) => {
  Entry.find()
    .then(entries => res.status(200).json(entries))
    .catch(err => console.log(err));
});

router.post('/admin/api/entries', h.loggedIn, (req, res) => {
  const { title, sectionId } = req.body;
  const slug = h.slugify(title);

  Section.findById(sectionId)
    .then((section) => {
      if (!section) res.status(409).json({ success: false, message: 'That section does not exist.' });

      Entry.findOne({ slug }).then((entry) => {
        if (entry) res.status(409).json({ success: false, message: 'There is already an entry with that slug.' });
        const newEntry = new Entry();

        newEntry.title = title;
        newEntry.slug = slug;
        newEntry.section = section._id;
        newEntry.dateCreated = Date.now();

        return newEntry.save().then((savedEntry) => {
          section.entries = [...section.entries, savedEntry._id];
          section.save().then(() => res.status(200).json({ success: true }));
        });
      })
      .catch(err => new Error(err));
    })
    .catch(err => new Error(err));
});

module.exports = router;
