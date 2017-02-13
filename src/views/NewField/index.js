import React, { Component, PropTypes } from 'react';
import { newField } from '../../actions/fieldActions';
import Page from '../../containers/Page';

export default class NewField extends Component {
  static propTypes = {
    dispatch: PropTypes.func,
  }

  constructor(props) {
    super(props);
    this.onSubmit = this.onSubmit.bind(this);
  }

  onSubmit(e) {
    e.preventDefault();
    this.props.dispatch(newField(this.title.value, this.type.value));
  }

  render() {
    return (
      <Page name="new-field">
        <form onSubmit={this.onSubmit}>
          <input type="text" name="title" ref={(r) => { this.title = r; }} />
          <input type="text" name="type" ref={(r) => { this.type = r; }} />
          <input type="submit" value="Add Field" />
        </form>
      </Page>
    );
  }
}
