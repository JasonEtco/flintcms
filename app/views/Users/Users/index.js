import React, { Component } from 'react';
import { Link } from 'react-router';
import { formatDate } from '../../../utils/helpers';
import Page from '../../../containers/Page';
import TitleBar from '../../../components/TitleBar';
import Table from '../../../components/Table';
import t from '../../../utils/types';

export default class Users extends Component {
  static propTypes = {
    users: t.users,
  }

  static defaultProps = {
    users: null,
  }

  render() {
    const { users } = this.props;

    const reduced = users.users.map(props => ({
      key: props._id,
      image: {
        sortBy: false,
        component: <img src={`/public/assets/${props.image}`} alt={props.username} />,
      },
      username: {
        value: props.username,
        component: <Link to={`/admin/users/${props._id}`}>{props.username}</Link>,
      },
      name: `${props.name.first} ${props.name.last}`,
      dateCreated: {
        value: new Date(props.dateCreated).getTime(),
        component: formatDate(props.dateCreated),
      },
    }));

    return (
      <Page name="users">
        <TitleBar title="Users">
          <Link to="/admin/users/new" className="btn btn--small">New User</Link>
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
