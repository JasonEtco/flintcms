const mongoose = require('mongoose');
const h = require('../../utils/helpers');
const express = require('express');
const app = require('../../index');

const io = app.get('io');

const Entry = mongoose.model('Entry');
const Section = mongoose.model('Section');

const router = express.Router();

router.post('/entries', (req, res) => {
  const { title, sectionId, fields } = req.body;
  const slug = h.slugify(title);

  process.nextTick(() => {
    Section.findById(sectionId)
      .then((section) => {
        if (!section) res.status(409).json({ success: false, message: 'That section does not exist.' });

        Entry.findOne({ slug }).then((entry) => {
          if (entry) {
            res.status(409).json({ success: false, message: 'There is already an entry with that slug.' });
            return;
          }

          const values = fields
            .reduce((prev, curr) =>
              Object.assign({}, prev, { [curr.fieldSlug]: curr.value }), {});

          const newEntry = new Entry(values);

          newEntry.title = title;
          newEntry.slug = slug;
          newEntry.section = section._id;
          newEntry.fields = fields;
          newEntry.dateCreated = Date.now();
          newEntry.author = req.user._id;

          newEntry.save()
            .then((savedEntry) => {
              io.emit('new-entry', savedEntry);
              res.status(200).json(savedEntry);
            })
            .catch(err => new Error(err));
        })
        .catch(err => new Error(err));
      })
      .catch(err => new Error(err));
  });
});

module.exports = router;
