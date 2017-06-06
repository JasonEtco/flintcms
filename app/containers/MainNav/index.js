import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import Icon from 'utils/icons';
import t from 'utils/types';
import getUserPermissions from 'utils/getUserPermissions';
import './MainNav.scss';

const NavItem = ({ to, icon, children }) => (
  <li className="nav__list-item">
    <Link className="nav__list-item__link" to={to}>
      <Icon icon={icon} />
      {children}
    </Link>
  </li>);

NavItem.propTypes = {
  to: PropTypes.string.isRequired,
  icon: PropTypes.string.isRequired,
  children: PropTypes.string.isRequired,
};

export default class MainNav extends Component {
  static propTypes = {
    siteName: PropTypes.string,
    user: t.user.isRequired,
    open: PropTypes.bool.isRequired,
  }

  static defaultProps = {
    siteName: 'Example Flint Site',
  }

  render() {
    const { user, open } = this.props;
    const perms = getUserPermissions();
    const showSection = obj => obj && Object.keys(obj).some(v => obj[v]);

    const showSettings =
      showSection(perms.sections) ||
      showSection(perms.fields) ||
      showSection(perms.assets) ||
      showSection(perms.users) ||
      perms.site.canManageSite ||
      perms.site.canCustomStyles ||
      perms.site.canManagePlugins;

    const links = [
      { to: '/', icon: 'home', children: 'Home' },
      { to: '/entries', icon: 'newspaper', children: 'Entries' },
      { to: '/users', icon: 'user', children: 'Users' },
      { to: '/settings', icon: 'gear', children: 'Settings', hidden: !showSettings },
    ];

    return (
      <nav className={`nav ${open ? 'is-open' : ''}`}>
        <a href="/" target="_blank" rel="noopener noreferrer" className="nav__sitename">
          {this.props.siteName}
        </a>
        <ul className="nav__list">
          {links.filter(link => !link.hidden).map(link => <NavItem key={link.to} {...link} />)}
        </ul>

        <div className="nav__user">
          <div className="nav__user__avatar">
            <img src={`/public/assets/${user.image}`} alt={user.username} />
          </div>
          <div className="nav__user__text">
            <Link className="nav__user__text__title" to={`/users/${user._id}`}>Hey {user.name ? user.name.first : user.username}!</Link>
            <a className="nav__user__text__logout" href="/admin/logout">Logout</a>
          </div>
        </div>
      </nav>
    );
  }
}
