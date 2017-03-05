import React, { Component } from 'react';
import h from '../../utils/helpers';
import Icon from '../../utils/icons';
import Page from '../../containers/Page';
import TitleBar from '../../components/TitleBar';
import Table from '../../components/Table';

export default class Entries extends Component {
  render() {
    const { users } = this.props;

    const reduced = users.users.map(props => ({
      image: {
        sortBy: false,
        component: <img src={props.image} alt={props.username} />,
      },
      username: props.username,
      dateCreated: {
        value: new Date(props.dateCreated).getTime(),
        component: h.formatDate(props.dateCreated),
      },
    }));

    return (
      <Page name="users">
        <TitleBar title="Users" />

        <div className="content">
          <div className="page__inner">
            {reduced.length > 0 ? <Table data={reduced} sortBy="username" /> : <h3>No users!</h3>}
          </div>
        </div>
      </Page>
    );
  }
}
