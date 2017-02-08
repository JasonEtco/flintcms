import React, { Component } from 'react';
import types from '../../types';
import { newEntry } from '../../../actions/entryActions';

export default class Entries extends Component {
  static propTypes = {
    ...types.entries,
    ...types.sections,
  }
  constructor(props) {
    super(props);
    this.onSubmit = this.onSubmit.bind(this);
  }

  onSubmit(e) {
    e.preventDefault();
    this.props.dispatch(newEntry(this.title.value, this.section.value));
  }

  render() {
    return (
      <div>
        Entries

        <div>
          <form onSubmit={this.onSubmit}>
            <input type="text" name="title" ref={(r) => { this.title = r; }} />
            <select ref={(r) => { this.section = r; }}>
              {this.props.sections.sections.map(section => <option key={section._id} value={section._id}>{section.title}</option>)}
            </select>
            <input type="submit" value="Add Section" />
          </form>
        </div>

        {this.props.entries.entries.map(entry => <h3 key={entry._id}>{entry.title}</h3>)}
      </div>
    );
  }
}
