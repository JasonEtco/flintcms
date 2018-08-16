const express = require('express')
const nun = require('./nunjucks')

module.exports = (app, logger) => {
  const templates = express()
  nun.express(templates)

  templates.get('/', async (req, res) => {
    res.render('index.njk')
  })

  return templates
}
