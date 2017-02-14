import React, { Component, PropTypes } from 'react';
import { newEntry } from '../../actions/entryActions';
import Button from '../../components/Button';

export default class NewEntry extends Component {
  static propTypes = {
    dispatch: PropTypes.func,
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
        <form onSubmit={this.onSubmit}>
          <input type="text" name="title" ref={(r) => { this.title = r; }} />
          <select ref={(r) => { this.section = r; }}>
            {this.props.sections.sections.map(section => <option key={section._id} value={section._id}>{section.title}</option>)}
          </select>
          <Button type="submit">Add Entry</Button>
        </form>
      </div>
    );
  }
}
