import React, { Component } from 'react';
import { Link } from 'react-router';
import types from '../../utils/types';

export default class Entries extends Component {
  static propTypes = {
    ...types.entries,
    ...types.sections,
  }

  render() {
    const { entries } = this.props;

    return (
      <div>
        Entries

        {entries.entries.map(entry => (
          <h3 key={entry._id}><Link to={`/admin/entries/${entry._id}`}>{entry.title}</Link></h3>
        ))}
      </div>
    );
  }
}
