import React, { Component } from 'react'
import PropTypes from 'prop-types'
import serialize from 'form-serialize'
import Page from 'containers/Page'
import Input from 'components/Input'
import TitleBar from 'components/TitleBar'
import Button from 'components/Button'
import Checkboxes from 'components/Checkbox/Checkboxes'
import { updateUserGroup } from 'actions/usergroupActions'
import t from 'utils/types'
import { capitalize } from 'utils/helpers'
import { withRouter } from 'react-router'
import permissions from '../../../../server/utils/permissions.json'

export default withRouter(class UserGroup extends Component {
  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    usergroups: t.usergroups.isRequired,
    match: PropTypes.shape({
      params: PropTypes.shape({
        slug: PropTypes.string.isRequired
      }).isRequired
    }).isRequired
  }

  constructor (props) {
    super(props)

    const { usergroups, match } = props
    const { slug } = match.params
    this.usergroup = usergroups.usergroups.find(e => e.slug === slug)

    this.handleSubmit = this.handleSubmit.bind(this)
  }

  handleSubmit (e) {
    e.preventDefault()
    const { dispatch } = this.props
    const data = serialize(this.page.form, { hash: true, empty: true })
    dispatch(updateUserGroup(this.usergroup._id, data))
  }

  render () {
    const { usergroups, match } = this.props
    const { slug } = match.params
    const groupPerms = usergroups.usergroups.find(g => g.slug === slug).permissions

    const perms = Object.keys(permissions).reduce((prev, curr) => ({
      ...prev,
      [curr]: permissions[curr]
        .map(perm => ({ ...perm, defaultValue: groupPerms[curr][perm.name] }))
    }), {})

    return (
      <Page name="usergroup" onSubmit={this.handleSubmit} ref={(r) => { this.page = r }}>
        <TitleBar title={this.usergroup.title}>
          <Button type="submit" small>Save User Group</Button>
        </TitleBar>
        <div className="content">
          <div className="page__inner">
            <Input
              name="title"
              label="Title"
              ref={(r) => { this.title = r }}
              required
              full
              defaultValue={this.usergroup.title}
            />

            {Object.keys(perms).map(key => <Checkboxes key={key} label={capitalize(key)} checkboxes={perms[key]} name={`permissions[${key}]`} />)}
          </div>
        </div>
      </Page>
    )
  }
})
