import React, { Component, PropTypes } from 'react';
import { addNewSection } from '../../actions/sectionActions';

class NewSection extends Component {
  static propTypes = {
    dispatch: PropTypes.func,
  }

  constructor(props) {
    super(props);
    this.onSubmit = this.onSubmit.bind(this);
  }

  onSubmit(e) {
    e.preventDefault();
    addNewSection(this.title.value);
  }

  render() {
    return (
      <div>
        <form onSubmit={this.onSubmit}>
          <input type="text" name="title" ref={(r) => { this.title = r; }} />
          <input type="submit" value="Add Section" />
        </form>
      </div>
    );
  }
}

export default NewSection;
