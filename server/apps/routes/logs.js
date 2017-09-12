const express = require('express');
const path = require('path');
const { promisify } = require('util');
const fs = require('fs');

const readFile = promisify(fs.readFile);

const router = express.Router();

module.exports = () => {
  router.get('/logs', async (req, res) => {
    const { logsPath } = global.FLINT;
    const flintLog = await readFile(path.join(logsPath, 'flint.log'), { encoding: 'utf-8' });
    const httpLog = await readFile(path.join(logsPath, 'http-requests.log'), { encoding: 'utf-8' });

    const flint = flintLog.split('\n');
    const http = httpLog.split('\n');

    res.json({ flint, http });
  });

  return router;
};
