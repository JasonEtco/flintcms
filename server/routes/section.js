const mongoose = require('mongoose');
const h = require('../utils/helpers');

const Section = mongoose.model('Section');

module.exports = (app, io) => {
  app.get('/admin/api/sections', h.loggedIn, (req, res) => {
    Section.find()
      .then(entries => res.status(200).json(entries))
      .catch(err => new Error(err));
  });

  app.post('/admin/api/sections', h.loggedIn, (req, res) => {
    const { title, template, fields } = req.body;

    if (fields.length === 0) {
      res.status(409).json({ success: false, message: 'You must include at least one field.' });
      return;
    }

    if (!title) {
      res.status(409).json({ success: false, message: 'You must include a title.' });
      return;
    }

    const slug = h.slugify(title);

    process.nextTick(() => {
      Section.findOne({ slug }).then((section) => {
        if (section) {
          res.status(409).json({ success: false, message: 'There is already a section with that slug.' });
          return;
        }
        const newSection = new Section();

        newSection.title = title;
        newSection.template = template;
        newSection.slug = slug;
        newSection.fields = fields;
        newSection.dateCreated = Date.now();

        newSection.save()
        .then((savedSection) => {
          io.emit('new-section', savedSection);
          res.status(200).json({ success: true, slug: savedSection.slug });
        })
        .catch(err => new Error(err));
      })
      .catch(err => new Error(err));
    });
  });
};
