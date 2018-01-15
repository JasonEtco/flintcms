const fs = require('fs');
const path = require('path');
const stringify = require('json-stringify-safe');
const collectData = require('./collect-data');

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

  // Check that the template file actually exists, or try built in template
  if (!fs.existsSync(templatePath)) {
    throw new Error('no-template');
  }

  // Collect site's data (entries, pages, sections, users, etc)
  const compiledData = await collectData(data).catch(console.log); // eslint-disable-line no-console

  let html = await global.FLINT.nun.render(templatePath, compiledData);

  /* istanbul ignore if */
  if (!html) return 'no-html';

  if (global.FLINT.debugMode) {
    const scr = `
    console.log('%cFlint Debug Mode', 'color: #fe6300; font-weight: bold; font-size: 1.2rem;');

    console.groupCollapsed('this');
      console.log(${stringify(compiledData.this)});
    console.groupEnd();

    console.groupCollapsed('flint');
      console.table(${stringify(compiledData.flint.pages)});
      console.table(${stringify(compiledData.flint.entries)});
      console.table(${stringify(compiledData.flint.sections)});
      console.table(${stringify(compiledData.flint.fields)});
    console.groupEnd();
    `;

    html = await html.replace('</body>', `<script>${scr}</script></body>`);
  }

  return html;
}

module.exports = compile;
