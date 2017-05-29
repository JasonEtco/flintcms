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

exports.writeFileAsync = (file, data, options = { encoding: 'utf8' }) => new Promise((resolve, reject) => {
  fs.writeFile(file, data, options, (err, f) => {
    if (err) reject(err);
    else resolve(f);
  });
});

exports.readFileAsync = (file, encoding = 'utf8') => new Promise((resolve, reject) => {
  fs.readFile(file, encoding, (err, f) => {
    if (err) reject(err);
    else resolve(f);
  });
});
