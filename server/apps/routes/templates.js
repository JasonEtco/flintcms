const express = require('express');
const path = require('path');
const fs = require('fs');

const router = express.Router();

router.get('/templates', (req, res) => {
  const walkSync = (dir, filelist) => {
    const files = fs.readdirSync(dir);
    let newFilelist = filelist || [];

    files.forEach((file) => {
      if (fs.statSync(path.join(dir, file)).isDirectory() && !file.startsWith('_')) {
        newFilelist = walkSync(path.join(dir, file), newFilelist);
      } else if (!file.startsWith('_')) {
        newFilelist.push(file);
      }
    });
    return newFilelist;
  };

  res.status(200).json(walkSync(global.FLINT.templatePath));
});

module.exports = router;
