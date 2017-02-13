import React, { Component, PropTypes } from 'react';
import { newSection } from '../../actions/sectionActions';
import Page from '../../containers/Page';

export default class NewSection extends Component {
  render() {
    console.log('hello!');

    return (
      <Page name="new-section">
        <form>
          <input type="text" name="title" ref={(r) => { this.title = r; }} />
          <input type="submit" value="Add Section" />
        </form>
      </Page>
    );
  }
}
