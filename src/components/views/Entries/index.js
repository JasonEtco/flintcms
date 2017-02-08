import React, { Component } from 'react';
import types from '../../types';

export default class Entries extends Component {
  static propTypes = {
    ...types.entries,
  }

  render() {
    return (
      <div>
        Entries

        {this.props.entries.entries.map(entry => <h3 key={entry._id}>{entry.title}</h3>)}
      </div>
    );
  }
}
