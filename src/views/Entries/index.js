import React, { Component } from 'react';
import { Link, browserHistory } from 'react-router';
import types from '../../utils/types';
import h from '../../utils/helpers';
import Page from '../../containers/Page';
import TitleBar from '../../components/TitleBar';
import SecondaryNav from '../../components/SecondaryNav';

export default class Entries extends Component {
  static propTypes = {
    ...types.entries,
    ...types.sections,
  }

  componentWillMount() {
    const { section } = this.props.params;
    const ref = localStorage.getItem('lastSection');

    if (section) {
      localStorage.setItem('lastSection', section);
    } else if (ref) {
      browserHistory.push(`/admin/entries/${ref}`);
    }
  }

  render() {
    const { sections, entries, params } = this.props;
    const { section } = params;
    const filtered = section === undefined
      ? entries.entries
      : entries.entries.filter(e => e.section === h.getIdFromSlug(sections.sections, section));
    const navLinks = sections.sections.map(sec => ({ label: sec.title, path: `/admin/entries/${sec.slug}` }));

    return (
      <Page name="entries">
        <TitleBar title="Entries">
          <Link to={`/admin/entries/${section || 'none'}/new`} className="btn">new entry</Link>
        </TitleBar>

        <div className="content">
          <SecondaryNav links={navLinks}>
            <Link to="/admin/entries" onClick={() => localStorage.removeItem('lastSection')}>All</Link>
          </SecondaryNav>

          <div className="page__inner">
            {filtered.map(entry => (
              <h3 key={entry._id}><Link key={entry._id} to={`/admin/entries/${h.getSlugFromId(sections.sections, entry.section)}/${entry._id}`}>{entry.title}</Link></h3>
            ))}
          </div>
        </div>
      </Page>
    );
  }
}
