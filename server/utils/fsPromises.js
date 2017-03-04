const fs = require('fs');

exports.readdirAsync = pathToAssets => new Promise((resolve, reject) => {
  fs.readdir(pathToAssets, (err, files) => {
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
