import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';
import { formatDate } from 'utils/helpers';
import Page from 'containers/Page';
import Table from 'components/Table';
import TitleBar from 'components/TitleBar';
import t from 'utils/types';
import DeleteIcon from 'components/DeleteIcon';
import { deleteSection } from 'actions/sectionActions';

export default class Sections extends Component {
  static propTypes = {
    sections: t.sections,
    dispatch: PropTypes.func,
  }

  static defaultProps = {
    dispatch: null,
    sections: null,
  }

  render() {
    const { sections, dispatch } = this.props;

    const reduced = sections.sections.map(props => ({
      key: props._id,
      title: {
        value: props.title,
        component: <Link to={`/admin/settings/sections/${props.slug}`}>{props.title}</Link>,
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
          onClick={() => dispatch(deleteSection(props._id))}
          message="Are you sure you want to delete this section and all entries in it?"
        />,
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
