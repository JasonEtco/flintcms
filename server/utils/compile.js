const Handlebars = require('handlebars');
const fs = require('fs');
const path = require('path');
const collectData = require('./collectData');
const siteConfig = require('../../config');

module.exports = async (template, data = {}) => {
  const compiledData = await collectData(data);

  return new Promise((resolve, reject) => {
    const templateWithFormat = template.endsWith('.hbs') ? template : `${template}.hbs`;
    const templatePath = path.resolve(__dirname, '..', '..', 'templates', templateWithFormat);

    fs.readFile(templatePath, 'utf-8', async (err, file) => {
      if (err) reject(err);

      const compiled = await Handlebars.compile(file);
      let html = await compiled(compiledData);

      if (process.env.DEBUG || siteConfig.debugMode) {
        const scr = `
        console.log('%cFlint Debug Mode', 'color: #fe6300; font-weight: bold; font-size: 1.2rem;');

        console.groupCollapsed('Entry');
          console.log(${JSON.stringify(compiledData.entry)});
        console.groupEnd();

        console.groupCollapsed('Flint');
          console.table(${JSON.stringify(compiledData.flint.entries)});
          console.table(${JSON.stringify(compiledData.flint.sections)});
          console.table(${JSON.stringify(compiledData.flint.fields)});
        console.groupEnd();
        `;

        html = await html.replace('</body>', `<script>${scr}</script></body>`);
      }

      resolve(html);
    });
  });
};
