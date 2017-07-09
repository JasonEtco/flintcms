import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { formatDate } from 'utils/helpers';
import Page from 'containers/Page';
import Empty from 'containers/Empty';
import Table from 'components/Table';
import TitleBar from 'components/TitleBar';
import t from 'utils/types';
import DeleteIcon from 'components/DeleteIcon';
import { deleteSection } from 'actions/sectionActions';

export default class Sections extends Component {
  static propTypes = {
    sections: t.sections.isRequired,
    dispatch: PropTypes.func.isRequired,
  }

  render() {
    const { sections, dispatch } = this.props;

    const reduced = sections.sections.map(props => ({
      key: props._id,
      title: {
        value: props.title,
        component: <Link to={`/settings/sections/${props.slug}`}>{props.title}</Link>,
      },
      slug: {
        value: props.slug,
        component: <code>{props.slug}</code>,
      },
      handle: {
        value: props.handle,
        component: <code>{props.handle}</code>,
      },
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
          <Link to="/settings/sections/new" className="btn btn--small">New Section</Link>
        </TitleBar>

        <div className="content">
          <div className="page__inner">
            {reduced.length > 0 ? <Table data={reduced} /> : (
              <Empty>
                There are no Sections! Go ahead and <Link to="/settings/sections/new">make one.</Link>
              </Empty>
            )}
          </div>
        </div>
      </Page>
    );
  }
}
