import React, { Component } from 'react';
import { Link } from 'react-router';
import h from '../../utils/helpers';
import Page from '../../containers/Page';
import Table from '../../components/Table';
import TitleBar from '../../components/TitleBar';
import types from '../../utils/types';
import DeleteIcon from '../../components/DeleteIcon';
import { deleteUserGroup } from '../../actions/usergroupActions';

export default class UserGroups extends Component {
  static propTypes = {
    ...types.usergroups,
  }

  render() {
    const { usergroups, dispatch } = this.props;

    const reduced = usergroups.usergroups.map(props => ({
      key: props._id,
      title: {
        value: props.title,
        component: <Link to={`/admin/settings/usergroups/${props.slug}`}>{props.title}</Link>,
      },
      slug: props.slug,
      dateCreated: {
        value: new Date(props.dateCreated).getTime(),
        component: h.formatDate(props.dateCreated),
      },
      delete: {
        sortBy: false,
        component: <DeleteIcon
          dispatch={dispatch}
          onClick={() => dispatch(deleteUserGroup(props._id))}
          message="Are you sure you want to delete this asset?"
        />,
      },
    }));

    return (
      <Page name="usergroups">
        <TitleBar title="User Groups">
          <Link to="/admin/settings/usergroups/new" className="btn btn--small">New User Group</Link>
        </TitleBar>

        <div className="content">
          <div className="page__inner">
            {reduced.length > 0 ? <Table data={reduced} /> : <h3>No user groups!</h3>}
          </div>
        </div>
      </Page>
    );
  }
}
