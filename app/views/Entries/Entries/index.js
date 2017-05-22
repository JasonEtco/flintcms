import React, { Component, PropTypes } from 'react';
import { Link, browserHistory } from 'react-router';
import t from 'utils/types';
import { deleteEntry } from 'actions/entryActions';
import { truncate, getIdFromSlug, getSlugFromId, formatDate } from 'utils/helpers';
import DeleteIcon from 'components/DeleteIcon';
import Page from 'containers/Page';
import TitleBar from 'components/TitleBar';
import SecondaryNav from 'components/SecondaryNav';
import Table from 'components/Table';
import StatusDot from 'components/StatusDot';

const localStorageKey = 'flint:lastSection';

export default class Entries extends Component {
  static propTypes = {
    entries: t.entries,
    sections: t.sections,
    params: PropTypes.shape({
      section: PropTypes.string,
    }),
    dispatch: PropTypes.func,
  }

  static defaultProps = {
    params: null,
    dispatch: null,
    entries: null,
    sections: null,
    users: null,
  }

  componentWillMount() {
    const { section } = this.props.params;
    const { sections } = this.props.sections;
    const ref = localStorage.getItem(localStorageKey);

    if (section) {
      localStorage.setItem(localStorageKey, section);
    } else if (ref) {
      const refExists = sections.some(obj => obj.slug === ref);
      if (refExists) {
        browserHistory.push(`/admin/entries/${ref}`);
      } else {
        localStorage.removeItem(localStorageKey);
      }
    }
  }

  render() {
    const { params, dispatch } = this.props;
    const { entries } = this.props.entries;
    const { sections } = this.props.sections;

    if (sections.length === 0) {
      return (
        <Page name="entries">
          <TitleBar title="Entries" />

          <div className="content">
            <div className="page__inner">
              <h1>Make a section first!</h1>
            </div>
          </div>
        </Page>
      );
    }

    const { section } = params;
    const filtered = section === undefined
      ? entries
      : entries.filter(e => e.section === getIdFromSlug(sections, section));
    const navLinks = sections.map(sec => ({ label: sec.title, path: `/admin/entries/${sec.slug}` }));

    const reduced = filtered.map(props => ({
      key: props._id,
      title: {
        value: props.title,
        component: <Link to={`/admin/entries/${getSlugFromId(sections, props.section)}/${props._id}`}>{truncate(props.title, 30)}</Link>,
      },
      slug: props.slug,
      dateCreated: {
        value: new Date(props.dateCreated).getTime(),
        component: formatDate(props.dateCreated),
      },
      author: props.author.username,
      status: {
        sortBy: false,
        component: <StatusDot status={props.status} />,
      },
      delete: {
        sortBy: false,
        component: <DeleteIcon
          dispatch={dispatch}
          onClick={() => dispatch(deleteEntry(props._id))}
          message="Are you sure you want to delete this entry?"
        />,
      },
    }));

    return (
      <Page name="entries">
        <TitleBar title="Entries">
          {!!section && <Link to={`/admin/entries/${section}/new`} className="btn btn--small">New Entry</Link>}
        </TitleBar>

        <div className="content">
          <SecondaryNav links={navLinks}>
            <Link to="/admin/entries" activeClassName="is-active" onClick={() => localStorage.removeItem(localStorageKey)}>All</Link>
          </SecondaryNav>

          <div className="page__inner">
            {filtered.length > 0 ? <Table data={reduced} sortBy="dateCreated" /> : <h3>No entries!</h3>}
          </div>
        </div>
      </Page>
    );
  }
}
