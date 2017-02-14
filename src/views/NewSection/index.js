import React, { Component, PropTypes } from 'react';
import { newSection } from '../../actions/sectionActions';
import Page from '../../containers/Page';

export default class NewSection extends Component {
  componentDidMount() {
    fetch('/admin/api/templates', {
      credentials: 'same-origin',
      headers: new Headers({
        'Content-Type': 'application/json',
      }),
    })
    .then(res => res.json())
    .then(json => console.log(json))
    .catch(err => new Error(err));
  }

  render() {
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
