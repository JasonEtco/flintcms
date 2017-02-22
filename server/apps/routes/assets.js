const mongoose = require('mongoose');
const formidable = require('formidable');
const path = require('path');
const fs = require('fs');
const express = require('express');

const router = express.Router();
const Asset = mongoose.model('Asset');

router.get('/assets', (req, res) => {
  Asset.find()
    .then(users => res.status(200).json(users))
    .catch(err => new Error(err));
});

router.post('/assets', (req, res) => {
  process.nextTick(() => {
    const form = new formidable.IncomingForm();

    // specify that we want to allow the user to upload multiple files in a single request
    form.multiples = true;

    // store all uploads in the /uploads directory
    form.uploadDir = path.join(__dirname, '..', '..', '..', 'assets');

    // every time a file has been uploaded successfully,
    // rename it to it's orignal name
    form.on('file', (field, file) => {
      fs.rename(file.path, path.join(form.uploadDir, file.name));

      const newAsset = new Asset();

      newAsset.name = file.name;
      newAsset.extension = 'd';
      newAsset.filename = file.name;
      newAsset.width = 3;
      newAsset.height = 3;
      newAsset.size = 3;
      newAsset.mimeType = 'd';
      newAsset.dateUploaded = Date.now();

      newAsset.save()
        .then((savedAsset) => {
          res.status(200).json(savedAsset);
        })
        .catch(err => new Error(err));
    });

    // log any errors that occur
    form.on('error', (err) => {
      throw new Error(`An error has occured: \n${err}`);
    });

    // once all the files have been uploaded, send a response to the client
    form.on('end', () => {
      res.end('success');
    });

    // parse the incoming request containing the form data
    form.parse(req);
  });
});

module.exports = router;
