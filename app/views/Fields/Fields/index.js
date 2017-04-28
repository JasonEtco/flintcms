import React, { Component } from 'react';
import { Link } from 'react-router';
import { formatDate } from '../../../utils/helpers';
import Page from '../../../containers/Page';
import Table from '../../../components/Table';
import DeleteIcon from '../../../components/DeleteIcon';
import TitleBar from '../../../components/TitleBar';
import types from '../../../utils/types';
import { deleteField } from '../../../actions/fieldActions';

export default class Fields extends Component {
  static propTypes = {
    ...types.sections,
  }

  render() {
    const { fields, dispatch } = this.props;

    const reduced = fields.fields.map(props => ({
      key: props._id,
      title: {
        value: props.title,
        component: <Link to={`/admin/settings/fields/${props._id}`}>{props.title}</Link>,
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
          onClick={() => dispatch(deleteField(props._id))}
          message="Are you sure you want to delete this asset?"
        />,
      },
    }));

    return (
      <Page name="sections">
        <TitleBar title="Fields">
          <Link to="/admin/settings/fields/new" className="btn btn--small">New Field</Link>
        </TitleBar>

        <div className="content">
          <div className="page__inner">
            {reduced.length > 0 ? <Table data={reduced} /> : <h3>No fields!</h3>}
          </div>
        </div>
      </Page>
    );
  }
}
