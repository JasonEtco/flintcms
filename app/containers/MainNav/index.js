import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';
import Icon from '../../utils/icons';
import './MainNav.scss';

const NavItem = props => <li className="nav__list-item"><Link className="nav__list-item__link" to={props.to}>{props.children}</Link></li>;

NavItem.propTypes = {
  to: PropTypes.string.isRequired,
  children: PropTypes.array.isRequired,
};

export default class MainNav extends Component {
  static propTypes = {
    siteName: PropTypes.string,
  }

  static defaultProps = {
    siteName: 'Example Flint Site',
  }

  render() {
    return (
      <nav className="nav">
        <a href="/" target="_blank" rel="noopener noreferrer" className="nav__sitename">
          {this.props.siteName}
        </a>
        <ul className="nav__list">
          <NavItem to="/admin"><Icon icon="home" />Home</NavItem>
          <NavItem to="/admin/entries"><Icon icon="newspaper" />Entries</NavItem>
          <NavItem to="/admin/users"><Icon icon="user" />Users</NavItem>
          <NavItem to="/admin/settings"><Icon icon="gear" />Settings</NavItem>
        </ul>
        <a href="/admin/logout">
          Logout
        </a>
      </nav>
    );
  }
}
