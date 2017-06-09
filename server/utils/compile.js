const fs = require('fs');
const path = require('path');
const collectData = require('./collectData');
const { nun } = require('./nunjucks');

/**
 * Compiles template/data with Nunjucks into an HTML string
 * @param {String} template - The filename of the template to compile with
 * @param {Object} data
 * @returns {String} HTML String
 */
async function compile(template, data) {
  const compiledData = await collectData(data);

  return new Promise((resolve, reject) => {
    const templateWithFormat = template.endsWith('.njk') ? template : `${template}.njk`;
    const templatePath = path.join(global.FLINT.templatePath, templateWithFormat);

    fs.readFile(templatePath, 'utf-8', async (err) => {
      if (err) reject(err);

      let html = await nun.render(templatePath, compiledData);

      if (global.FLINT.debugMode) {
        const scr = `
        console.log('%cFlint Debug Mode', 'color: #fe6300; font-weight: bold; font-size: 1.2rem;');

        console.groupCollapsed('this');
          console.log(${JSON.stringify(compiledData.this)});
        console.groupEnd();

        console.groupCollapsed('flint');
          console.table(${JSON.stringify(compiledData.flint.pages)});
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
}

module.exports = compile;
