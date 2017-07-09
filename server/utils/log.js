const fs = require('fs');
const path = require('path');

const pathToLog = path.join(global.FLINT.logsPath, 'flint.log');
const stream = fs.createWriteStream(pathToLog, { flags: 'a' });

function log(str) {
  console.log(str); // eslint-disable-line no-console
  const timestamp = new Date().toISOString();
  const string = `[${timestamp}] - ${str}\n`;
  stream.write(string);
}

module.exports = log;
