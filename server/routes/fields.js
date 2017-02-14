const mongoose = require('mongoose');
const h = require('../utils/helpers');

const Field = mongoose.model('Field');

module.exports = (app, io) => {
  app.get('/admin/api/fields', h.loggedIn, (req, res) => {
    Field.find()
      .then(fields => res.status(200).json(fields))
      .catch(err => new Error(err));
  });

  app.post('/admin/api/fields', h.loggedIn, (req, res) => {
    const { title, type } = req.body;
    const slug = h.slugify(title);
    Field.findOne({ slug }).then((field) => {
      if (field) res.status(409).json({ success: false, message: 'There is already a field with that slug.' });

      const newField = new Field();

      newField.title = title;
      newField.type = type;
      newField.slug = slug;
      newField.dateCreated = Date.now();

      newField.save()
        .then((savedField) => {
          io.emit('new-field', savedField);
          res.status(200).json({ success: true });
        })
        .catch(err => new Error(err));
    })
    .catch(err => new Error(err));
  });
};
