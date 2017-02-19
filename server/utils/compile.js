const Handlebars = require('handlebars');
const fs = require('fs');
const path = require('path');
const collectData = require('./collectData');

module.exports = async (template, data) => {
  const compiledData = await collectData(data);

  return new Promise((resolve, reject) => {
    const templateWithFormat = template.endsWith('.hbs') ? template : `${template}.hbs`;
    const templatePath = path.resolve(__dirname, '..', '..', 'templates', templateWithFormat);

    fs.readFile(templatePath, 'utf-8', (err, file) => {
      if (err) reject(err);

      const compiled = Handlebars.compile(file);
      const html = compiled(compiledData);

      resolve(html);
    });
  });
};
