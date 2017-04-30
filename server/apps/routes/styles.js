const express = require('express');
const path = require('path');
const fs = require('fs');
const { loggedIn } = require('../../utils/helpers');
const { writeFileAsync } = require('../../utils/fsPromises');
const compileSass = require('../../utils/compileSass');
const dirTree = require('directory-tree');

const router = express.Router();
const pathToFiles = path.resolve(__dirname, '..', '..', '..', 'scss');

router.get('/styles', loggedIn, (req, res) => {
  if (req.query.f) {
    const pathToFile = path.resolve(pathToFiles, req.query.f);
    const contents = fs.readFileSync(pathToFile, 'utf-8');
    res.status(200).json(contents);
    return;
  }

  const scssFiles = dirTree(pathToFiles, ['.scss', '.css']);
  res.status(200).json(scssFiles);
});

router.post('/styles', loggedIn, async (req, res) => {
  const { file, contents } = req.body;
  const pathToFile = path.resolve(pathToFiles, file);
  await writeFileAsync(pathToFile, contents);
  compileSass()
    .then(() => {
      res.status(200).json({ success: true });
    })
    .catch((err) => {
      res.status(200).json({ success: false, err });
    });
});

module.exports = router;
