import React, { Component } from 'react';
import { Link } from 'react-router';
import types from '../../utils/types';
import { newEntry } from '../../actions/entryActions';
import Button from '../../components/Button';

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
            <Button type="submit">Add Entry</Button>
          </form>
        </div>

        {this.props.entries.entries.map(entry => (
          <h3 key={entry._id}><Link to={`/admin/entries/${entry._id}`}>{entry.title}</Link></h3>
        ))}
      </div>
    );
  }
}
