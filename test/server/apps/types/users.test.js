const mocks = require('../../../mocks')
const common = require('../common')
const mongoose = require('mongoose')

describe('Users', () => {
  let agent

  beforeAll(async () => {
    agent = await common.before()
  })

  afterAll(() => mongoose.disconnect())

  it('returns a list of users', async () => {
    const res = await agent
      .post('/graphql')
      .send({
        query: `
        {
          users {
            _id
            image
            name {
              first
              last
            }
            dateCreated
            username
            email
          }
        }`
      })
    expect(res.body).toEqual({
      data: {
        users: mocks.users.map(user => ({
          _id: user._id,
          image: user.image,
          dateCreated: user.dateCreated,
          username: user.username,
          email: user.email,
          name: user.name
        }))
      }
    })
  })

  it('can query for a specific user', async () => {
    const res = await agent
      .post('/graphql')
      .send({
        query: `query ($_id: ID!) {
          user (_id: $_id) {
            _id
            image
            usergroup {
              _id
            }
            name {
              first
              last
            }
            dateCreated
            username
            email
          }
        }`,
        variables: { _id: mocks.users[1]._id }
      })
    expect(res.body).toEqual({
      data: {
        user: {
          _id: mocks.users[1]._id,
          image: mocks.users[1].image,
          dateCreated: mocks.users[1].dateCreated,
          username: mocks.users[1].username,
          email: mocks.users[1].email,
          usergroup: {
            _id: mocks.users[1].usergroup
          },
          name: {
            first: mocks.users[1].name.first,
            last: mocks.users[1].name.last
          }
        }
      }
    })
  })

  it('can return a user\'s own details', async () => {
    const res = await agent
      .post('/graphql')
      .send({
        query: `{
          user {
            _id
            image
            usergroup {
              _id
            }
            name {
              first
              last
            }
            dateCreated
            username
            email
          }
        }`
      })
    expect(res.body).toEqual({
      data: {
        user: {
          _id: mocks.users[0]._id,
          image: mocks.users[0].image,
          dateCreated: mocks.users[0].dateCreated,
          username: mocks.users[0].username,
          email: mocks.users[0].email,
          usergroup: {
            _id: mocks.users[0].usergroup
          },
          name: {
            first: mocks.users[0].name.first,
            last: mocks.users[0].name.last
          }
        }
      }
    })
  })

  it('can delete a user from the database', async () => {
    const res = await agent
      .post('/graphql')
      .send({
        query: `
        mutation ($_id: ID!) {
          deleteUser (_id: $_id) {
            _id
            image
            name {
              first
              last
            }
            dateCreated
            username
            email
          }
        }`,
        variables: { _id: mocks.users[1]._id }
      })
    expect(res.body).toEqual({
      data: {
        deleteUser: {
          _id: mocks.users[1]._id,
          image: mocks.users[1].image,
          dateCreated: mocks.users[1].dateCreated,
          username: mocks.users[1].username,
          email: mocks.users[1].email,
          name: {
            first: mocks.users[1].name.first,
            last: mocks.users[1].name.last
          }
        }
      }
    })
  })

  it('can save a user to the database', async () => {
    const res = await agent
      .post('/graphql')
      .send({
        query: `
        mutation ($user: UserInput!) {
          addUser (user: $user) {
            usergroup {
              _id
            }
            name {
              first
              last
            }
            username
            email
          }
        }`,
        variables: {
          user: {
            username: mocks.users[1].username,
            email: mocks.users[1].email,
            usergroup: mocks.usergroups[0]._id,
            name: {
              first: mocks.users[1].name.first,
              last: mocks.users[1].name.last
            }
          }
        }
      })
    expect(res.body).toEqual({
      data: {
        addUser: {
          username: mocks.users[1].username,
          usergroup: {
            _id: mocks.users[1].usergroup
          },
          email: mocks.users[1].email,
          name: {
            first: mocks.users[1].name.first,
            last: mocks.users[1].name.last
          }
        }
      }
    })
  })

  it('throws when using an existing user\'s username', async () => {
    const res = await agent
      .post('/graphql')
      .send({
        query: `
        mutation ($user: UserInput!) {
          addUser (user: $user) {
            email
          }
        }`,
        variables: {
          user: {
            username: mocks.users[0].username,
            email: mocks.users[0].email,
            usergroup: mocks.usergroups[0]._id
          }
        }
      })
    expect(res.status).toEqual(500)
    expect(res.body.errors).toContainEqual(expect.objectContaining({
      message: 'There is already a user with that username.'
    }))
  })

  it('throws when using an existing user\'s email', async () => {
    const res = await agent
      .post('/graphql')
      .send({
        query: `
        mutation ($user: UserInput!) {
          addUser (user: $user) {
            email
          }
        }`,
        variables: {
          user: {
            username: 'fakeusername',
            email: mocks.users[0].email,
            usergroup: mocks.usergroups[0]._id
          }
        }
      })
    expect(res.status).toBe(500)
    expect(res.body.errors).toContainEqual(expect.objectContaining({
      message: 'There is already a user with that email.'
    }))
  })

  it('throws when a new user\'s usergroup does not exist', async () => {
    const res = await agent
      .post('/graphql')
      .send({
        query: `
        mutation ($user: UserInput!) {
          addUser (user: $user) {
            email
            usergroup {
              _id
            }
          }
        }`,
        variables: {
          user: {
            username: 'newusername',
            email: 'new@example.com',
            usergroup: '5946e850bd887652381ecfe2'
          }
        }
      })
    expect(res.status).toEqual(500)
    expect(res.body.errors).toContainEqual(expect.objectContaining({
      message: 'That UserGroup does not exist.'
    }))
  })

  it('can update an existing user', async () => {
    const res = await agent
      .post('/graphql')
      .send({
        query: `
        mutation ($_id: ID!, $data: UserInput!) {
          updateUser (_id: $_id, data: $data) {
            name {
              first
            }
          }
        }`,
        variables: {
          _id: mocks.users[0]._id,
          data: {
            email: mocks.users[0].email,
            usergroup: mocks.usergroups[0]._id,
            username: mocks.users[0].username,
            name: {
              first: 'Jason'
            }
          }
        }
      })
    // expect(res.status).to.deep.equal(200);
    expect(res.body).toEqual({
      data: {
        updateUser: {
          name: {
            first: 'Jason'
          }
        }
      }
    })
  })

  it('throws when updating a non-existing user', async () => {
    const res = await agent
      .post('/graphql')
      .send({
        query: `
        mutation ($_id: ID!, $data: UserInput!) {
          updateUser (_id: $_id, data: $data) {
            name {
              first
            }
          }
        }`,
        variables: {
          _id: '5946e850bd887652381ecfe8',
          data: {
            email: mocks.users[0].email,
            username: mocks.users[0].username,
            usergroup: mocks.usergroups[0]._id,
            name: {
              first: 'Jason'
            }
          }
        }
      })
    expect(res.body.errors).toContainEqual(expect.objectContaining({
      message: 'There is no User with this ID.'
    }))
  })

  it('can reset a user\'s password', async () => {
    const res = await agent
      .post('/graphql')
      .send({
        query: `mutation ($_id: ID!) {
          resetPassword (_id: $_id) {
            token
          }
        }`,
        variables: { _id: mocks.users[0]._id }
      })
    expect(res.body).toHaveProperty('data')
    expect(res.body.data).toHaveProperty('resetPassword')
    expect(res.body.data.resetPassword).toHaveProperty('token')
    expect(typeof res.body.data.resetPassword.token).toBe('string')
  })

  describe('Permissions', () => {
    beforeAll(async () => common.setNonAdmin(agent))

    it('throws when user is not allowed to edit other users', async () => {
      const res = await agent
        .post('/graphql')
        .send({
          query: `mutation ($_id: ID!, $data: UserInput!) {
            updateUser (_id: $_id, data: $data) {
              name {
                first
              }
            }
          }`,
          variables: {
            _id: mocks.users[1]._id,
            data: {
              email: mocks.users[1].email,
              username: mocks.users[1].username,
              name: {
                first: 'Jason'
              }
            }
          }
        })
      expect(res.body.errors).toContainEqual(expect.objectContaining({
        message: 'You do not have permission to edit users.'
      }))
    })

    it('allows a user to edit themselves', async () => {
      const res = await agent
        .post('/graphql')
        .send({
          query: `mutation ($_id: ID!, $data: UserInput!) {
            updateUser (_id: $_id, data: $data) {
              name {
                first
              }
            }
          }`,
          variables: {
            _id: mocks.users[0]._id,
            data: {
              email: mocks.users[0].email,
              username: mocks.users[0].username,
              usergroup: mocks.usergroups[2]._id,
              name: {
                first: 'Jason'
              }
            }
          }
        })
      expect(res.body).toEqual({
        data: { updateUser: { name: { first: 'Jason' } } }
      })
    })

    it('returns an error when changing a user\'s usergroup', async () => {
      const res = await agent
        .post('/graphql')
        .send({
          query: `mutation ($_id: ID!, $data: UserInput!) {
            updateUser (_id: $_id, data: $data) {
              name {
                first
              }
            }
          }`,
          variables: {
            _id: mocks.users[0]._id,
            data: {
              email: mocks.users[0].email,
              username: mocks.users[0].username,
              usergroup: mocks.usergroups[0]._id,
              name: {
                first: 'Jason'
              }
            }
          }
        })
      expect(res.body.errors).toContainEqual(expect.objectContaining({
        message: 'You do not have permission to change a user\'s usergroup.'
      }))
    })

    it('returns an error when resetting a user\'s password', async () => {
      const res = await agent
        .post('/graphql')
        .send({
          query: `mutation ($_id: ID!) {
            resetPassword (_id: $_id) {
              token
            }
          }`,
          variables: { _id: mocks.users[0]._id }
        })
      expect(res.body.errors).toContainEqual(expect.objectContaining({
        message: 'You do not have permission to manage users.'
      }))
    })

    afterAll(common.setAdmin)
  })
})
