import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';
import Page from '../../containers/Page';

export default class Settings extends Component {
  static propTypes = {
    children: PropTypes.element,
    dispatch: PropTypes.func,
  }

  static defaultProps = {
    children: null,
    dispatch: f => f,
  }

  render() {
    const links = [
      { label: 'Sections', path: '/admin/settings/sections' },
      { label: 'New Section', path: '/admin/settings/sections/new' },
      { label: 'Fields', path: '/admin/settings/fields' },
      { label: 'New Field', path: '/admin/settings/fields/new' },
    ];

    return (
      <Page name="settings">
        {links.map(l => <Link key={l.path} to={l.path}>{l.label}</Link>)}
      </Page>
    );
  }
}
