const Handlebars = require('handlebars');
const fs = require('fs');

module.exports = (template, data) =>
  new Promise((resolve, reject) => {
    fs.readFile(template, 'utf-8', (err, file) => {
      if (err) reject(err);

      const compiled = Handlebars.compile(file);
      const html = compiled(data);

      resolve(html);
    });
  });
