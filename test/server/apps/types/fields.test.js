const mocks = require('../../../mocks')
const common = require('../common')
const mongoose = require('mongoose')

describe('Fields', () => {
  let agent

  beforeAll(async () => {
    agent = await common.before()
  })

  afterAll(() => mongoose.disconnect())

  it('returns a list of fields', async () => {
    const res = await agent
      .post('/graphql')
      .send({
        query: `
        {
          fields {
            _id
            title
            options
            dateCreated
            handle
            slug
            required
            type
          }
        }`
      })
    expect(res.body).toEqual({
      data: {
        fields: mocks.fields
      }
    })
  })

  it('can query for a specific field', async () => {
    const res = await agent
      .post('/graphql')
      .send({
        query: `
        query ($_id: ID!) {
          field (_id: $_id) {
            _id
          }
        }`,
        variables: { _id: mocks.fields[0]._id }
      })
    expect(res.body).toEqual({
      data: {
        field: { _id: mocks.fields[0]._id }
      }
    })
  })

  it('can update a field in the database', async () => {
    const res = await agent
      .post('/graphql')
      .send({
        query: `
        mutation ($_id: ID!, $data: FieldInput!) {
          updateField (_id: $_id, data: $data) {
            title
          }
        }`,
        variables: {
          _id: mocks.fields[0]._id,
          data: {
            title: 'New title!',
            required: false,
            type: 'Text',
            options: {
              placeholder: 'Example!'
            }
          }
        }
      })
    expect(res.body).toEqual({
      data: {
        updateField: {
          title: 'New title!'
        }
      }
    })
  })

  it('can delete a field from the database', async () => {
    const res = await agent
      .post('/graphql')
      .send({
        query: `
        mutation ($_id: ID!) {
          removeField (_id: $_id) {
            _id
          }
        }`,
        variables: { _id: mocks.fields[0]._id }
      })
    expect(res.body).toEqual({
      data: {
        removeField: { _id: mocks.fields[0]._id }
      }
    })
  })

  it('can save a field to the database', async () => {
    const res = await agent
      .post('/graphql')
      .send({
        query: `
        mutation ($data: FieldInput!) {
          addField (data: $data) {
            title
            handle
            slug
            required
            options
            type
          }
        }`,
        variables: {
          data: {
            title: mocks.fields[0].title,
            required: mocks.fields[0].required,
            options: mocks.fields[0].options,
            type: mocks.fields[0].type
          }
        }
      })
    expect(res.body).toEqual({
      data: {
        addField: {
          title: mocks.fields[0].title,
          slug: mocks.fields[0].slug,
          handle: mocks.fields[0].handle,
          required: mocks.fields[0].required,
          options: mocks.fields[0].options,
          type: mocks.fields[0].type
        }
      }
    })
  })

  describe('Permissions', () => {
    beforeAll(async () => common.setNonAdmin(agent))

    it('cannot delete a field from the database', async () => {
      const res = await agent
        .post('/graphql')
        .send({
          query: `
          mutation ($_id: ID!) {
            removeField (_id: $_id) {
              _id
            }
          }`,
          variables: { _id: mocks.fields[0]._id }
        })
      expect(res.body.errors[0]).toMatchObject({
        message: 'You do not have permission to delete Fields.'
      })
    })

    it('cannot save a field to the database', async () => {
      const res = await agent
        .post('/graphql')
        .send({
          query: `
          mutation ($data: FieldInput!) {
            addField (data: $data) {
              title
            }
          }`,
          variables: {
            data: {
              title: 'Some text',
              required: false,
              type: 'Text',
              options: {
                placeholder: 'Text!'
              }
            }
          }
        })
      expect(res.body.errors[0]).toMatchObject({
        message: 'You do not have permission to create a new Field.'
      })
    })

    afterAll(common.setAdmin)
  })
})
