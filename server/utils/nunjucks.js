const path = require('path');
const nunjucks = require('nunjucks');
const siteConfig = require('../../config');

const templatesDir = path.resolve(__dirname, '..', '..', 'templates');
exports.templatesDir = templatesDir;

const nun = nunjucks.configure(templatesDir, {
  noCache: process.env.NODE_ENV !== 'production',
});

Object.keys(siteConfig).forEach((key) => {
  nun.addGlobal(key, siteConfig[key]);
});

nun.addGlobal('getContext', () => this.ctx);

nun.addFilter('json', obj => `<pre><code>${JSON.stringify(obj, null, 2)}</code></pre>`);

exports.nun = nun;
