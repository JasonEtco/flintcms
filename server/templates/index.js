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
module.exports = (app, db, logger) => {
  const templates = express()
  nun.express(templates)

  templates.get('/new', async (req, res) => {
    const entry = new db.models.Entry({
      title: 'Test',
      slug: 'test'
    })

    await entry.save()
    res.send(entry.title)
  })

  templates.get('/', async (req, res) => {
    const query = `{ entries { title } }`
    const result = await graphql(schema, query)
    console.log(result)
    res.render('index.njk', result.data)
  })

  return templates
}
