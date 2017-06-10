import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { formatDate } from 'utils/helpers';
import Page from 'containers/Page';
import Empty from 'containers/Empty';
import Table from 'components/Table';
import TitleBar from 'components/TitleBar';
import t from 'utils/types';
import Icon from 'utils/icons';
import getUserPermissions from 'utils/getUserPermissions';
import DeleteIcon from 'components/DeleteIcon';
import { deletePage } from 'actions/pageActions';

export default class Pages extends Component {
  static propTypes = {
    pages: t.pages.isRequired,
    dispatch: PropTypes.func.isRequired,
    settings: PropTypes.bool,
  }

  static defaultProps = {
    settings: true,
  }

  render() {
    const { pages, dispatch, settings } = this.props;
    const perms = getUserPermissions();

    const reduced = pages.pages.map(props => ({
      key: props._id,
      title: {
        value: props.title,
        component: <Link to={settings ? `/settings/pages/${props.slug}` : `/pages/${props._id}`}>{props.title}</Link>,
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
        component: settings ? <DeleteIcon
          dispatch={dispatch}
          onClick={() => dispatch(deletePage(props._id))}
          message="Are you sure you want to delete this page and all entries in it?"
        /> : null,
      },
      homepage: {
        sortBy: false,
        component: props.homepage && <Icon icon="home" />,
      },
    }));

    const links = [
      { label: 'Settings', path: '/settings/' },
      { label: 'Pages', path: '/settings/pages' },
    ];

    return (
      <Page name="pages" links={settings ? links : null}>
        <TitleBar title="Pages">
          {settings && perms.pages.canAddPages && <Link to="/settings/pages/new" className="btn btn--small">New Page</Link>}
        </TitleBar>

        <div className="content">
          <div className="page__inner">
            {reduced.length > 0 ? <Table data={reduced} /> : (
              <Empty>
                There are no Pages! Go ahead and <Link to="/settings/pages/new">make one.</Link>
              </Empty>
            )}
          </div>
        </div>
      </Page>
    );
  }
}
