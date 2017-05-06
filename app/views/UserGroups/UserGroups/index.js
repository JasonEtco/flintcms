import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';
import { formatDate } from 'utils/helpers';
import Page from 'containers/Page';
import Table from 'components/Table';
import TitleBar from 'components/TitleBar';
import t from 'utils/types';
import DeleteIcon from 'components/DeleteIcon';
import { deleteUserGroup } from 'actions/usergroupActions';

export default class UserGroups extends Component {
  static propTypes = {
    usergroups: t.usergroups,
    dispatch: PropTypes.func,
  }

  static defaultProps = {
    dispatch: null,
    usergroups: null,
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
        component: formatDate(props.dateCreated),
      },
      delete: {
        sortBy: false,
        component: <DeleteIcon
          dispatch={dispatch}
          onClick={() => dispatch(deleteUserGroup(props._id))}
          message="Are you sure you want to delete this user group?"
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
            {reduced.length > 0 ? <Table formElement data={reduced} /> : <h3>No user groups!</h3>}
          </div>
        </div>
      </Page>
    );
  }
}
