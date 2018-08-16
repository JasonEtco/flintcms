const express = require('express')
const graphqlHTTP = require('express-graphql')
const bodyParser = require('body-parser')
const schema = require('./schema')

// TODO: Replace with bunyan
const logger = console

const app = express()
app.use(bodyParser.json())

app.post('/graphql', graphqlHTTP({
  schema: schema,
  rootValue: {},
  graphiql: true
}))

app.use('/admin', require('./admin')(app, logger))

app.listen(3000, () => {
  console.log('http://localhost:3000')
})
