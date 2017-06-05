const nunjucks = require('nunjucks');

const nun = nunjucks.configure(global.FlintSettings.templatePath, {
  noCache: process.env.NODE_ENV !== 'production',
});

Object.keys(global.FlintSettings).forEach((key) => {
  nun.addGlobal(key, global.FlintSettings[key]);
});

nun.addGlobal('getContext', () => this.ctx);

nun.addFilter('json', obj => `<pre><code>${JSON.stringify(obj, null, 2)}</code></pre>`);

nunjucks.precompile(global.FlintSettings.templatePath, { env: nun });

exports.nun = nun;
