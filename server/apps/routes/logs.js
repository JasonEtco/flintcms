const express = require('express');
const path = require('path');
const { readFileAsync } = require('../../utils/fsPromises');

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
