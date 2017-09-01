const fs = require('fs');
const path = require('path');
const collectData = require('./collectData');

/**
 * Compiles template/data with Nunjucks into an HTML string
 * @param {String} template - The filename of the template to compile with
 * @param {Object} data
 * @returns {String} HTML String
 */
async function compile(template, data) {
  // Ensure that template has the .njk file extension
  const templateWithFormat = template.endsWith('.njk') ? template : `${template}.njk`;
  const templatePath = path.join(global.FLINT.templatePath, templateWithFormat);

  // Check that the template file actually exists
  if (!fs.existsSync(templatePath)) return 'no-template';

  // Collect site's data (entries, pages, sections, users, etc)
  const compiledData = await collectData(data).catch(console.log); // eslint-disable-line no-console

  let html = await global.FLINT.nun.render(templatePath, compiledData);
  if (!html) return 'no-html';

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

  return html;
}

module.exports = compile;
