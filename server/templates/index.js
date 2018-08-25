const express = require('express')
const nun = require('./nunjucks')
const { graphql } = require('graphql')
const schema = require('../schema')

/**
 * This Express sub-app handles the general templating
 * system for user-provided templates.
 * @param {object} app - Express App
 * @param {object} logger - Bunyan-esque logger
 */
module.exports = (app, logger) => {
  const templates = express()
  nun.express(templates)

  templates.get('/', async (req, res) => {
    const query = `{ hello }`
    const result = await graphql(schema, query)
    res.render('index.njk', result.data)
  })

  return templates
}
