const express = require('express');
const path = require('path');
const fs = require('fs');
const { loggedIn } = require('../../utils/helpers');
const dirTree = require('directory-tree');

const router = express.Router();

router.get('/styles', loggedIn, (req, res) => {
  const pathToFiles = path.resolve(__dirname, '..', '..', '..', 'scss');

  if (req.query.f) {
    const pathToFile = path.resolve(pathToFiles, req.query.f);
    const contents = fs.readFileSync(pathToFile, 'utf-8');
    res.status(200).json(contents);
    return;
  }

  const scssFiles = dirTree(pathToFiles, ['.scss', '.css']);
  res.status(200).json(scssFiles);
});

module.exports = router;
