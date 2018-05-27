const mocks = require('../../mocks')
const mongoose = require('mongoose')
const ConsolePlugin = require('../../fixtures/plugins/ConsolePlugin')
const common = require('./common')

describe('Plugin system', () => {
  let agent

  beforeAll(async () => {
    agent = await common.before([ConsolePlugin])
  })

  it('returns a list of plugins', async () => {
    const res = await agent
      .post('/graphql')
      .send({
        query: `{
          plugins {
            title
            name
            version
            uid
          }
        }`
      })

    expect(res.body).toEqual({
      data: {
        plugins: [
          {
            uid: mocks.plugins[0].uid,
            version: mocks.plugins[0].version,
            name: mocks.plugins[0].name,
            title: mocks.plugins[0].title
          }
        ]
      }
    })
  })

  afterAll(() => mongoose.disconnect())
})
