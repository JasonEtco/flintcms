const mongoose = require('mongoose');
const h = require('../utils/helpers');

const Entry = mongoose.model('Entry');
const Section = mongoose.model('Section');

module.exports = (app, io) => {
  app.get('/admin/api/entries', h.loggedIn, (req, res) => {
    Entry.find()
      .then(entries => res.status(200).json(entries))
      .catch(err => new Error(err));
  });

  app.post('/admin/api/entries', h.loggedIn, (req, res) => {
    const { title, sectionId, options } = req.body;
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
          newEntry.options = options;
          newEntry.dateCreated = Date.now();
          newEntry.author = req.user._id;

          newEntry.save()
            .then((savedEntry) => {
              io.emit('new-entry', savedEntry);
              res.status(200).json({ success: true });
            })
            .catch(err => new Error(err));
        })
        .catch(err => new Error(err));
      })
      .catch(err => new Error(err));
  });
};
