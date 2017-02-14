import React, { Component } from 'react';
import { Link } from 'react-router';
import Page from '../../containers/Page';
import Table from '../../components/Table';
import TitleBar from '../../components/TitleBar';
import types from '../../utils/types';

export default class Sections extends Component {
  static propTypes = {
    ...types.sections,
  }

  render() {
    const { sections } = this.props;

    const reduced = sections.sections.map(props => ({
      title: {
        value: props.title,
        component: <Link to={`/admin/settings/sections/${props.slug}`}>{props.title}</Link>,
      },
      slug: props.slug,
      dateCreated: props.dateCreated,
    }));

    return (
      <Page name="sections">
        <TitleBar title="Sections">
          <Link to="/admin/settings/sections/new" className="btn btn--small">New Section</Link>
        </TitleBar>

        <div className="content">
          <div className="page__inner">
            {reduced.length > 0 ? <Table data={reduced} /> : <h3>No sections!</h3>}
          </div>
        </div>
      </Page>
    );
  }
}
