const mongoose = require('mongoose');
const path = require('path');
const fs = require('fs');
const express = require('express');
const multer = require('multer');
const { graphql } = require('graphql');

const schema = require('../../graphql');

const router = express.Router();
const Asset = mongoose.model('Asset');

router.get('/assets', (req, res) => {
  Asset.find()
    .then(users => res.status(200).json(users))
    .catch(err => new Error(err));
});

// Multer provides multipart form data parsing.
const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post('/assets', upload.single('file'), (req, res) => {
  const { originalname, buffer, size, mimetype } = req.file;
  process.nextTick(async () => {
    console.log(req.file);
    const query = `mutation {
      addAsset(data: {
       title: "${originalname}",
       filename: "${originalname}",
       size: ${size},
       mimetype: "${mimetype}"
     }) {
       _id
       title
       filename
       filesize
       mimetype
       width
       height
       extension
     }
    }`;

    fs.writeFileSync(path.join(__dirname, '..', '..', '..', 'assets', originalname), buffer);

    const { data, errors } = await graphql(schema, query);
    console.log(data, errors);
    res.end('success');
  });
});

module.exports = router;
