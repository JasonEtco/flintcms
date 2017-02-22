const mongoose = require('mongoose');
const h = require('../../utils/helpers');
const express = require('express');
const app = require('../../index');

const io = app.get('io');

const router = express.Router();

const Field = mongoose.model('Field');

router.get('/fields', (req, res) => {
  Field.find()
    .then(fields => res.status(200).json(fields))
    .catch(err => new Error(err));
});

router.post('/fields', (req, res) => {
  const { title, type, instructions } = req.body;
  const slug = h.slugify(title);
  Field.findOne({ slug }).then((field) => {
    if (field) res.status(409).json({ success: false, message: 'There is already a field with that slug.' });

    const newField = new Field();

    newField.title = title;
    newField.instructions = instructions;
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

module.exports = router;
