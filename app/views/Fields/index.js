import React, { Component } from 'react';
import { Link } from 'react-router';
import moment from 'moment';
import Page from '../../containers/Page';
import Table from '../../components/Table';
import TitleBar from '../../components/TitleBar';
import types from '../../utils/types';

export default class Fields extends Component {
  static propTypes = {
    ...types.sections,
  }

  render() {
    const { fields } = this.props;

    const reduced = fields.fields.map(props => ({
      title: {
        value: props.title,
        component: <Link to={`/admin/settings/sections/${props.slug}`}>{props.title}</Link>,
      },
      slug: props.slug,
      dateCreated: moment(props.dateCreated).format('DD/MM/YYYY'),
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
