const express = require('express');
const mongoose = require('mongoose');
const h = require('../utils/helpers');

const Asset = mongoose.model('Asset');

const router = express.Router();

router.get('/admin/api/assets', h.loggedIn, (req, res) => {
  Asset.find()
    .then(users => res.status(200).json(users))
    .catch(err => new Error(err));
});

router.post('/admin/api/assets', h.loggedIn, (req, res) => {
  process.nextTick(() => {
    const newAsset = new Asset();

    newAsset.title = title;
    newAsset.extension = extension;
    newAsset.filename = filename;
    newAsset.width = width;
    newAsset.height = height;
    newAsset.size = size;
    newAsset.mimeType = mimeType;
    newAsset.dateUploaded = Date.now();

    newAsset.save()
      .then((savedEntry) => {
        res.status(200).json(savedEntry);
      })
      .catch(err => new Error(err));
  })
  .catch(err => new Error(err));
});

module.exports = router;
