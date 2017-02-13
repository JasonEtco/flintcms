import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';
import Page from '../../containers/Page';

export default class Settings extends Component {
  static propTypes = {
  };

  render() {
    const links = [
      { label: 'Sections', path: '/admin/settings/sections' },
      { label: 'New Section', path: '/admin/settings/sections/new' },
      { label: 'Fields', path: '/admin/settings/fields' },
    ];

    return (
      <Page name="settings">
        {links.map(l => <Link to={l.path}>{l.label}</Link>)}
      </Page>
    );
  }
}
