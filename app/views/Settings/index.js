import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';
import Icon from '../../utils/icons';
import Page from '../../containers/Page';
import TitleBar from '../../components/TitleBar';
import './Settings.scss';

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
    const content = [
      { label: 'Sections', path: '/admin/settings/sections', icon: 'stack' },
      { label: 'Fields', path: '/admin/settings/fields', icon: 'fileText' },
      { label: 'Assets', path: '/admin/settings/assets', icon: 'pencil' },
    ];

    return (
      <Page name="settings">
        <TitleBar title="Settings" />
        <div className="content">
          <div className="page__inner">
            <section className="settings__section">
              <h2 className="settings__section__title">Content</h2>
              {content.map(l =>
                <Link className="settings__link" key={l.path} to={l.path}>
                  <Icon icon={l.icon} width={48} height={48} />
                  {l.label}
                </Link>)}
            </section>
          </div>
        </div>
      </Page>
    );
  }
}
