import React, { Component } from 'react';
import { Link } from 'react-router';
import h from '../../utils/helpers';
import Page from '../../containers/Page';
import Table from '../../components/Table';
import TitleBar from '../../components/TitleBar';
import types from '../../utils/types';
import Icon from '../../utils/icons';
import { deleteSection } from '../../actions/sectionActions';

export default class Sections extends Component {
  static propTypes = {
    ...types.sections,
  }

  deleteSection(id) {
    this.props.dispatch(deleteSection(id));
  }

  render() {
    const { sections } = this.props;

    const reduced = sections.sections.map(props => ({
      key: props._id,
      title: {
        value: props.title,
        component: <Link to={`/admin/settings/sections/${props.slug}`}>{props.title}</Link>,
      },
      slug: props.slug,
      dateCreated: {
        value: new Date(props.dateCreated).getTime(),
        component: h.formatDate(props.dateCreated),
      },
      delete: {
        sortBy: false,
        component: <button className="table__delete" onClick={() => this.deleteSection(props._id)}><Icon icon="circleWithLine" /></button>,
      },
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
