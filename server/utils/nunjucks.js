const nunjucks = require('nunjucks');
const dateFilter = require('nunjucks-date-filter');

/**
 * Returns the value of a field in an entry, or null
 * if the field does not exist.
 * @param {object} entry - Entry object
 * @param {string} handle - Handle of the target field
 * @returns {string|null}
 */
function fieldFilter(entry, handle) {
  const { fields } = entry;
  const fieldObj = fields.find(field => field.handle === handle);
  if (!fieldObj) return null;
  return fieldObj.value;
}

module.exports = (pathToTemplates) => {
  const nun = nunjucks.configure([global.FLINT.systemTemplatePath, pathToTemplates], {
    noCache: process.env.NODE_ENV !== 'production',
    autoescape: false,
  });

  Object.keys(global.FLINT).forEach((key) => {
    if (key === 'nun') return;
    nun.addGlobal(key, global.FLINT[key]);
  });

  nun.addGlobal('getContext', () => this.ctx);

  nun.addFilter('json', obj => `<pre><code>${JSON.stringify(obj, null, 2)}</code></pre>`);
  nun.addFilter('date', dateFilter);
  nun.addFilter('field', fieldFilter);

  nunjucks.precompile(pathToTemplates, { env: nun });

  return nun;
};
