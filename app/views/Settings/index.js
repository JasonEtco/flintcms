import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Icon from 'utils/icons';
import t from 'utils/types';
import Page from 'containers/Page';
import TitleBar from 'components/TitleBar';
import getUserPermissions from 'utils/getUserPermissions';
import './Settings.scss';

export default class Settings extends Component {
  static propTypes = {
    user: t.user.isRequired,
  }

  render() {
    const perms = getUserPermissions();
    const showSection = obj => obj && Object.keys(obj).some(v => obj[v]);

    const sections = {
      Content: [
        { label: 'Sections', path: '/settings/sections', icon: 'stack', hidden: !showSection(perms.sections) },
        { label: 'Fields', path: '/settings/fields', icon: 'fileText', hidden: !showSection(perms.fields) },
        { label: 'Assets', path: '/settings/assets', icon: 'images', hidden: !showSection(perms.assets) },
      ],
      Management: [
        { label: 'User Groups', path: '/settings/usergroups', icon: 'users', hidden: !perms.usergroups.canViewUserGroups },
      ],
      General: [
        { label: 'Site Settings', path: '/settings/general', icon: 'gear', hidden: !perms.site.canManageSite },
        { label: 'Custom Styles', path: '/settings/styles', icon: 'paint', hidden: !perms.site.canCustomStyles },
        { label: 'Plugins', path: '/settings/plugins', icon: 'plug', hidden: !perms.site.canManagePlugins },
      ],
    };

    return (
      <Page name="settings">
        <TitleBar title="Settings" />
        <div className="content">
          <div className="page__inner">
            {Object.keys(sections).map((key) => {
              const sectionLinks = sections[key].filter(l => !l.hidden);
              if (sectionLinks.length === 0) return null;

              return (
                <section className="settings__section" key={key}>
                  <h2 className="settings__section__title">{key}</h2>
                  {sectionLinks.map(l => (
                    <Link className="settings__link" key={l.path} to={l.path}>
                      <Icon icon={l.icon} width={48} height={48} />
                      {l.label}
                    </Link>))}
                </section>
              );
            })}
          </div>
        </div>
      </Page>
    );
  }
}
