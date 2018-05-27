const supertest = require('supertest')
const mocks = require('../../mocks')
const Flint = require('../../../index.js')
const mongoose = require('mongoose')

describe('First time install', () => {
  let server
  let agent

  beforeAll(async () => {
    const flintServer = new Flint({ listen: false })
    server = await flintServer.startServer()
    await mongoose.model('User').remove()
    agent = supertest.agent(server)
  })

  it('GET /admin/firstinstall returns true', async () => {
    const res = await agent.get('/admin/firstinstall')
    expect(res.status).toBe(200)
    expect(res.body).toEqual({ firstTimeInstall: true })
  })

  it('creates a first new user', async () => {
    const res = await agent.post('/admin/firstuser').send(mocks.user)
    expect(res.status).toBe(200)
    expect(res.body).toEqual({ success: true })
  })

  it('GET /admin/firstinstall returns false', async () => {
    const res = await agent.get('/admin/firstinstall')
    expect(res.status).toBe(200)
    expect(res.body).toEqual({ firstTimeInstall: false })
  })

  it('returns a message when a user already exists', async () => {
    const res = await agent.post('/admin/firstuser').send(mocks.user)
    expect(res.status).toBe(200)
    expect(res.body).toEqual({
      success: false,
      message: 'There is already a user in the database.'
    })
  })

  it('logs in a user', (done) => {
    agent
      .post('/admin/login')
      .send({ email: mocks.user.email, password: mocks.user.password })
      .expect(200)
      .end(done)
  })

  afterAll(() => mongoose.disconnect())
})
