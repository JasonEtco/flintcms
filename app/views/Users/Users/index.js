import React, { Component } from 'react';
import { func } from 'prop-types';
import { Link } from 'react-router-dom';
import { formatDate } from 'utils/helpers';
import Page from 'containers/Page';
import TitleBar from 'components/TitleBar';
import Table from 'components/Table';
import getUserPermissions from 'utils/getUserPermissions';
import t from 'utils/types';
import { deleteUser } from 'actions/userActions';
import DeleteIcon from 'components/DeleteIcon';
import Avatar from 'components/Avatar';

export default class Users extends Component {
  static propTypes = {
    users: t.users.isRequired,
    user: t.user.isRequired,
    dispatch: func.isRequired,
  }

  render() {
    const { users, dispatch, user } = this.props;

    const reduced = users.users.map(props => ({
      key: props._id,
      image: {
        sortBy: false,
        component: <Avatar user={props} />,
      },
      username: {
        value: props.username,
        component: <Link to={`/users/${props._id}`}>{props.username}</Link>,
      },
      name: props.name.first && props.name.last ? `${props.name.first} ${props.name.last}` : '-',
      dateCreated: {
        value: new Date(props.dateCreated).getTime(),
        component: formatDate(props.dateCreated),
      },
      delete: user.usergroup.permissions.users.canDeleteUsers ? {
        sortBy: false,
        component: <DeleteIcon
          dispatch={dispatch}
          onClick={() => dispatch(deleteUser(props._id))}
          message="Are you sure you want to delete this user?"
        />,
      } : null,
    }));

    const perms = getUserPermissions();

    return (
      <Page name="users">
        <TitleBar title="Users">
          {perms.users.canAddUsers && <Link to="/users/new" className="btn btn--small">New User</Link>}
        </TitleBar>

        <div className="content">
          <div className="page__inner">
            {reduced.length > 0 ? <Table data={reduced} sortBy="username" /> : <h3>No users!</h3>}
          </div>
        </div>
      </Page>
    );
  }
}
