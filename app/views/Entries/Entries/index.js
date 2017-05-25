import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import t from 'utils/types';
import { deleteEntry } from 'actions/entryActions';
import { truncate, getIdFromSlug, getSlugFromId, formatDate } from 'utils/helpers';
import DeleteIcon from 'components/DeleteIcon';
import Page from 'containers/Page';
import TitleBar from 'components/TitleBar';
import SecondaryNav from 'components/SecondaryNav';
import Table from 'components/Table';
import StatusDot from 'components/StatusDot';
import { withRouter } from 'react-router';

const localStorageKey = 'flint:lastSection';

export default withRouter(class Entries extends Component {
  static propTypes = {
    entries: t.entries,
    sections: t.sections,
    match: PropTypes.shape({
      params: PropTypes.shape({
        section: PropTypes.string,
      }),
    }).isRequired,
    dispatch: PropTypes.func,
    history: PropTypes.object.isRequired,
  }

  static defaultProps = {
    dispatch: null,
    entries: null,
    sections: null,
    users: null,
  }

  componentWillMount() {
    const { section } = this.props.match.params;
    const { sections } = this.props.sections;
    const ref = localStorage.getItem(localStorageKey);

    if (section) {
      localStorage.setItem(localStorageKey, section);
    } else if (ref) {
      const refExists = sections.some(obj => obj.slug === ref);
      if (refExists) {
        this.props.history.push(`/entries/${ref}`);
      } else {
        localStorage.removeItem(localStorageKey);
      }
    }
  }

  render() {
    const { match, dispatch } = this.props;
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

    const { section } = match.params;
    const filtered = section === undefined
      ? entries
      : entries.filter(e => e.section === getIdFromSlug(sections, section));
    const navLinks = sections.map(sec => ({ label: sec.title, path: `/entries/${sec.slug}` }));

    const reduced = filtered.map(props => ({
      key: props._id,
      title: {
        value: props.title,
        component: <Link to={`/entries/${getSlugFromId(sections, props.section)}/${props._id}`}>{truncate(props.title, 30)}</Link>,
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
          {!!section && <Link to={`/entries/${section}/new`} className="btn btn--small">New Entry</Link>}
        </TitleBar>

        <div className="content">
          <SecondaryNav links={navLinks}>
            <Link to="/entries" activeClassName="is-active" onClick={() => localStorage.removeItem(localStorageKey)}>All</Link>
          </SecondaryNav>

          <div className="page__inner">
            {filtered.length > 0 ? <Table data={reduced} sortBy="dateCreated" /> : <h3>No entries!</h3>}
          </div>
        </div>
      </Page>
    );
  }
});
