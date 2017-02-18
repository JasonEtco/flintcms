const Handlebars = require('handlebars');
const fs = require('fs');
const path = require('path');

module.exports = (template, data) =>
  new Promise((resolve, reject) => {
    const templateWithFormat = template.endsWith('.hbs') ? template : `${template}.hbs`;
    const templatePath = path.resolve(__dirname, '..', '..', 'templates', templateWithFormat);

    fs.readFile(templatePath, 'utf-8', (err, file) => {
      if (err) reject(err);

      const compiled = Handlebars.compile(file);
      const html = compiled(data.toObject());

      resolve(html);
    });
  });
