import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';
import Icon from 'utils/icons';
import './MainNav.scss';

const NavItem = props => (
  <li className="nav__list-item">
    <Link className="nav__list-item__link" to={props.to}>
      <Icon icon={props.icon} />
      {props.children}
    </Link>
  </li>);

NavItem.propTypes = {
  to: PropTypes.string.isRequired,
  icon: PropTypes.string.isRequired,
  children: PropTypes.array.isRequired,
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
  }

  static defaultProps = {
    siteName: 'Example Flint Site',
  }

  state = { open: true }

  render() {
    const { user } = this.props;
    const { open } = this.state;

    return (
      <div className="nav-wrapper">
        <button type="button" onClick={() => this.setState({ open: !open })}>=</button>
        <nav className={`nav ${open ? 'is-open' : ''}`}>
          <a href="/" target="_blank" rel="noopener noreferrer" className="nav__sitename">
            {this.props.siteName}
          </a>
          <ul className="nav__list">
            <NavItem to="/admin" icon="home">Home</NavItem>
            <NavItem to="/admin/entries" icon="newspaper">Entries</NavItem>
            <NavItem to="/admin/users" icon="user">Users</NavItem>
            <NavItem to="/admin/settings" icon="gear">Settings</NavItem>
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
      </div>
    );
  }
}
