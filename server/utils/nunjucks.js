const nunjucks = require('nunjucks');
const dateFilter = require('nunjucks-date-filter');

const nun = nunjucks.configure(global.FLINT.templatePath, {
  noCache: process.env.NODE_ENV !== 'production',
});

Object.keys(global.FLINT).forEach((key) => {
  nun.addGlobal(key, global.FLINT[key]);
});

nun.addGlobal('getContext', () => this.ctx);

nun.addFilter('json', obj => `<pre><code>${JSON.stringify(obj, null, 2)}</code></pre>`);
nun.addFilter('date', dateFilter);

nunjucks.precompile(global.FLINT.templatePath, { env: nun });

exports.nun = nun;
