import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { updateUser, userDetails, sendPasswordReset } from 'actions/userActions'
import Page from 'containers/Page'
import Input from 'components/Input'
import Button from 'components/Button'
import TitleBar from 'components/TitleBar'
import Dropdown from 'components/Fields/Dropdown'
import Aside from 'containers/Aside'
import t from 'utils/types'
import { arrayMove } from 'utils/helpers'
import { withRouter } from 'react-router'

export default withRouter(class User extends Component {
  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    users: t.users.isRequired,
    usergroups: t.usergroups.isRequired,
    match: PropTypes.shape({
      params: PropTypes.shape({
        id: PropTypes.string.isRequired
      }).isRequired
    }).isRequired
  }

  constructor (props) {
    super(props)
    this.onSubmit = this.onSubmit.bind(this)
    this.sendPasswordReset = this.sendPasswordReset.bind(this)
  }

  componentDidMount () {
    const { dispatch, match, users } = this.props
    const { full } = users.users.find(e => e._id === match.params.id)
    if (!full || full === undefined) {
      dispatch(userDetails(match.params.id))
    }
  }

  onSubmit () {
    const { username, first, last, email, props, usergroup } = this
    this.props.dispatch(updateUser(props.match.params.id, {
      username: username.value,
      email: email.value,
      name: {
        first: first.value,
        last: last.value
      },
      usergroup: usergroup.value
    }))
  }

  sendPasswordReset () {
    const { id } = this.props.match.params
    this.props.dispatch(sendPasswordReset(id))
  }

  render () {
    const { users, match } = this.props
    const { usergroups } = this.props.usergroups
    const user = users.users.find(u => u._id === match.params.id)

    if (user.full === undefined) return null

    const userTitle = user.name && user.name.first ? `${user.name.first} ${user.name.last}` : user.email

    const links = [
      { label: 'Users', path: '/users' },
      { label: userTitle, path: `/users/${match.params.id}` }
    ]

    const adminIndex = usergroups.findIndex(u => u.slug === 'admin')
    const orderedUsergroups = arrayMove(usergroups, adminIndex, 0)
    const formattedUsergroups = orderedUsergroups.map(u => ({ label: u.title, value: u._id }))

    return (
      <Page name="user" links={links} onSubmit={this.onSubmit} ref={(r) => { this.page = r }}>
        <TitleBar title={userTitle}>
          <Button onClick={this.onSubmit} small>Save</Button>
        </TitleBar>

        <div className="content">
          <div className="page__inner">
            <Input
              name="email"
              label="Email"
              type="email"
              ref={(r) => { this.email = r }}
              required
              full
              defaultValue={user.email}
            />

            <Input
              name="username"
              label="Username"
              ref={(r) => { this.username = r }}
              required
              full
              readOnly
              defaultValue={user.username}
            />

            <Input
              name="first"
              label="First Name"
              ref={(r) => { this.first = r }}
              full
              defaultValue={user.name ? user.name.first : undefined}
            />

            <Input
              name="last"
              label="Last Name"
              ref={(r) => { this.last = r }}
              full
              defaultValue={user.name ? user.name.last : undefined}
            />
          </div>

          <Aside noStatus dateCreated={user.dateCreated}>
            <Dropdown
              label="Usergroup"
              name="usergroup"
              full
              ref={(r) => { this.usergroup = r }}
              options={formattedUsergroups}
            />
            <Button small formElement onClick={this.sendPasswordReset}>Reset Password</Button>
          </Aside>
        </div>
      </Page>
    )
  }
})
