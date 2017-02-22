const express = require('express');
const path = require('path');
const fs = require('fs');

const router = express.Router();

router.get('/templates', (req, res) => {
  const walkSync = (dir, filelist) => {
    const files = fs.readdirSync(dir);
    filelist = filelist || [];
    files.forEach((file) => {
      if (fs.statSync(path.join(dir, file)).isDirectory() && !file.startsWith('_')) {
        filelist = walkSync(path.join(dir, file), filelist);
      } else if (!file.startsWith('_')) {
        filelist.push(file);
      }
    });
    return filelist;
  };
  const pathToTemplates = path.resolve(__dirname, '..', '..', 'templates');

  res.status(200).json(walkSync(pathToTemplates));
});

module.exports = router;
