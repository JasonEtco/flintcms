const express = require('express')
const graphqlHTTP = require('express-graphql')
const bodyParser = require('body-parser')
const schema = require('./schema')
const logger = require('./utils/logger')

const app = express()
app.use(bodyParser.json())

app.post('/graphql', graphqlHTTP({
  schema: schema,
  rootValue: {},
  graphiql: true
}))

app.use('/admin', require('./admin')(app, logger))
app.use(require('./templates')(app, logger))

app.listen(3000, () => {
  logger.info('http://localhost:3000')
})
