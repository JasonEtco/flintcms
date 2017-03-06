import React, { Component } from 'react';
import { Link } from 'react-router';
import h from '../../utils/helpers';
import Page from '../../containers/Page';
import TitleBar from '../../components/TitleBar';
import Table from '../../components/Table';

export default class Users extends Component {
  render() {
    const { users } = this.props;

    const reduced = users.users.map(props => ({
      image: {
        sortBy: false,
        component: <img src={props.image} alt={props.username} />,
      },
      username: props.username,
      name: `${props.name.first} ${props.name.last}`,
      dateCreated: {
        value: new Date(props.dateCreated).getTime(),
        component: h.formatDate(props.dateCreated),
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
