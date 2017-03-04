const mongoose = require('mongoose');
const path = require('path');
const express = require('express');
const multer = require('multer');
const jimp = require('jimp');
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

router.post('/assets', upload.single('file'), async (req, res) => {
  process.nextTick(async () => {
    const { body, file } = req;
    const { originalname, buffer, size, mimetype } = file;

    const pathToFile = path.join(__dirname, '..', '..', '..', 'assets', originalname);

    const jimpFile = await jimp.read(buffer);
    const { width, height } = jimpFile.bitmap;
    await jimpFile.write(pathToFile);

    const query = `mutation {
      addAsset(data: {
       title: "${body.title}",
       filename: "${originalname}",
       size: ${size},
       width: ${width},
       height: ${height},
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

    const { errors } = await graphql(schema, query);
    res.end(errors.length > 0 ? errors : 'success');
  });
});

module.exports = router;
