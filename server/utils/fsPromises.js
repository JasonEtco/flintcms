const fs = require('fs');

exports.readdirAsync = (path, options = { encoding: 'utf8' }) => new Promise((resolve, reject) => {
  fs.readdir(path, options, (err, files) => {
    if (err) reject(err);
    else resolve(files);
  });
});

exports.statAsync = file => new Promise((resolve, reject) => {
  fs.stat(file, (err, f) => {
    if (err) reject(err);
    else resolve(f);
  });
});
