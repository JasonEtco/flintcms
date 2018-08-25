const nunjucks = require('nunjucks')
const dateFilter = require('nunjucks-date-filter')
const awaitFilter = require('nunjucks-await-filter')
const path = require('path')

const pathToTemplates = path.join(process.cwd(), 'templates')

const nun = nunjucks.configure(pathToTemplates, {
  noCache: process.env.NODE_ENV !== 'production',
  autoescape: false
})

nun.addGlobal('getContext', () => this.ctx)

nun.addFilter('json', obj => `<pre><code>${JSON.stringify(obj, null, 2)}</code></pre>`)
nun.addFilter('date', dateFilter)
awaitFilter(nun)

nunjucks.precompile(pathToTemplates, { env: nun })

module.exports = nun
