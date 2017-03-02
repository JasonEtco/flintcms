const mongoose = require('mongoose');
const path = require('path');
const fs = require('fs');
const express = require('express');
const multer = require('multer');
const { graphql } = require('graphql');

const getAssetDetails = require('../../utils/getAssetDetails');
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
    const { originalname, buffer, size, mimetype } = req.file;
    const pathToFile = path.join(__dirname, '..', '..', '..', 'assets', originalname);

    await fs.writeFile(pathToFile, buffer, err => new Error(err));
    const { width, height } = await getAssetDetails(pathToFile);

    const query = `mutation {
      addAsset(data: {
       title: "${originalname}",
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
    res.end(errors.length > 0 ? 'error' : 'success');
  });
});

module.exports = router;
