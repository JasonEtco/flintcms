import React, { Component } from 'react';
import { Link, browserHistory } from 'react-router';
import types from '../../utils/types';
import h from '../../utils/helpers';

export default class Entries extends Component {
  static propTypes = {
    ...types.entries,
    ...types.sections,
  }

  render() {
    const { sections, entries, params } = this.props;
    const { section } = params;
    const filtered = section === undefined || section === 'all'
      ? entries.entries
      : entries.entries.filter(e => e.section === h.getIdFromSlug(sections.sections, section));

    return (
      <div>
        Entries
        <nav>
          <Link to="/admin/entries/all">All</Link>
          {sections.sections.map(sec => <Link key={sec._id} to={`/admin/entries/${sec.slug}`}>{sec.title}</Link>)}
        </nav>

        {filtered.map(entry => (
          <h3 key={entry._id}><Link key={entry._id} to={`/admin/entries/${h.getSlugFromId(sections.sections, entry.section)}/${entry._id}`}>{entry.title}</Link></h3>
        ))}
      </div>
    );
  }
}
