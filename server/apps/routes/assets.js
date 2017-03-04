const mongoose = require('mongoose');
const path = require('path');
const express = require('express');
const multer = require('multer');
const jimp = require('jimp');
const { graphql } = require('graphql');
const app = require('../../index');

const io = app.get('io');

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
    const writtenFile = await jimpFile.write(pathToFile);
    if (!writtenFile) throw new Error('There was an erroring saving your file.');

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
       size
       mimetype
       width
       height
       extension
     }
    }`;

    const { errors, data } = await graphql(schema, query, { io });
    if (errors !== undefined && errors.length > 0) {
      res.status(500).json(errors);
    } else {
      res.status(200).json(data);
    }
  });
});

module.exports = router;
