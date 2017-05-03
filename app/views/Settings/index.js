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
    const sections = {
      Content: [
        { label: 'Sections', path: '/admin/settings/sections', icon: 'stack' },
        { label: 'Fields', path: '/admin/settings/fields', icon: 'fileText' },
        { label: 'Assets', path: '/admin/settings/assets', icon: 'images' },
      ],
      Management: [
        { label: 'User Groups', path: '/admin/settings/usergroups', icon: 'users' },
      ],
      General: [
        { label: 'Site Settings', path: '/admin/settings/general', icon: 'gear' },
        { label: 'Custom Styles', path: '/admin/settings/styles', icon: 'image' },
      ],
    };

    return (
      <Page name="settings">
        <TitleBar title="Settings" />
        <div className="content">
          <div className="page__inner">
            {Object.keys(sections).map(key => (
              <section className="settings__section" key={key}>
                <h2 className="settings__section__title">{key}</h2>
                {sections[key].map(l =>
                  <Link className="settings__link" key={l.path} to={l.path}>
                    <Icon icon={l.icon} width={48} height={48} />
                    {l.label}
                  </Link>)}
              </section>
            ))}
          </div>
        </div>
      </Page>
    );
  }
}
