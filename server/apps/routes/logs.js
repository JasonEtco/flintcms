const express = require('express');
const path = require('path');
const { promisify } = require('util');
const fs = require('fs');

const readFileAsync = promisify(fs.readFile);

const router = express.Router();

router.get('/logs', async (req, res) => {
  const { logsPath } = global.FLINT;
  const flintLog = await readFileAsync(path.join(logsPath, 'flint.log'));
  const httpLog = await readFileAsync(path.join(logsPath, 'http-requests.log'));

  const flint = flintLog.split('\n');
  const http = httpLog.split('\n');

  res.json({
    flint,
    http,
  });
});

module.exports = router;
