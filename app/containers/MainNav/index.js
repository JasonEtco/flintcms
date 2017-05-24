import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';
import Icon from 'utils/icons';
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
    user: PropTypes.shape({
      _id: PropTypes.string,
      username: PropTypes.string,
      name: PropTypes.shape({
        first: PropTypes.string,
        last: PropTypes.string,
      }),
      email: PropTypes.string,
    }).isRequired,
    open: PropTypes.bool.isRequired,
  }

  static defaultProps = {
    siteName: 'Example Flint Site',
  }

  render() {
    const { user, open } = this.props;

    const links = [
      { to: '/admin', icon: 'home', children: 'Home' },
      { to: '/admin/entries', icon: 'newspaper', children: 'Entries' },
      { to: '/admin/users', icon: 'user', children: 'Users' },
      { to: '/admin/settings', icon: 'gear', children: 'Settings' },
    ];

    return (
      <nav className={`nav ${open ? 'is-open' : ''}`}>
        <a href="/" target="_blank" rel="noopener noreferrer" className="nav__sitename">
          {this.props.siteName}
        </a>
        <ul className="nav__list">
          {links.map(link => <NavItem key={link.to} {...link} />)}
        </ul>

        <div className="nav__user">
          <div className="nav__user__avatar">
            <img src={`/public/assets/${user.image}`} alt={user.username} />
          </div>
          <div className="nav__user__text">
            <Link className="nav__user__text__title" to={`/admin/users/${user._id}`}>Hey {user.name.first || user.username}!</Link>
            <a className="nav__user__text__logout" href="/admin/logout">Logout</a>
          </div>
        </div>
      </nav>
    );
  }
}
