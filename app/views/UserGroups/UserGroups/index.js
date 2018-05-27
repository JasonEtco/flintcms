import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import { formatDate } from 'utils/helpers'
import Page from 'containers/Page'
import Table from 'components/Table'
import TitleBar from 'components/TitleBar'
import t from 'utils/types'
import DeleteIcon from 'components/DeleteIcon'
import { deleteUserGroup } from 'actions/usergroupActions'
import getUserPermissions from 'utils/getUserPermissions'

export default class UserGroups extends Component {
  static propTypes = {
    usergroups: t.usergroups.isRequired,
    dispatch: PropTypes.func.isRequired
  }

  render () {
    const { usergroups, dispatch } = this.props

    const perms = getUserPermissions()
    const reduced = usergroups.usergroups.map(props => ({
      key: props._id,
      title: {
        value: props.title,
        component: props.slug === 'admin' ? <span>{props.title}</span> : <Link to={`/settings/usergroups/${props.slug}`}>{props.title}</Link>
      },
      slug: props.slug,
      dateCreated: {
        value: new Date(props.dateCreated).getTime(),
        component: formatDate(props.dateCreated)
      },
      delete: props.slug !== 'admin' ? {
        sortBy: false,
        component: <DeleteIcon
          dispatch={dispatch}
          onClick={() => dispatch(deleteUserGroup(props._id))}
          message='Are you sure you want to delete this user group?'
        />
      } : ''
    }))

    return (
      <Page name='usergroups'>
        <TitleBar title='User Groups'>
          {perms.usergroups.canAddUserGroups && <Link to='/settings/usergroups/new' className='btn btn--small'>New User Group</Link>}
        </TitleBar>

        <div className='content'>
          <div className='page__inner'>
            {reduced.length > 0 ? <Table formElement data={reduced} /> : <h3>No user groups!</h3>}
          </div>
        </div>
      </Page>
    )
  }
}
