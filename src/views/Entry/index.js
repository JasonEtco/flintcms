import React, { Component, PropTypes } from 'react';
import types from '../../utils/types';

export default class Entry extends Component {
  static propTypes = {
    ...types.entries,
    params: PropTypes.shape({
      id: PropTypes.string.isRequired,
    }).isRequired,
  }

  static defaultProps = {
    title: '',
  }

  render() {
    const { id } = this.props.params;
    const entry = this.props.entries.entries.find(e => e._id === id);

    return (
      <div>
        <input type="text" defaultValue={entry.title} />
      </div>
    );
  }
}
