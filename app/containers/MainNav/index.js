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
    user: PropTypes.shape({
      _id: PropTypes.string,
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

  render() {
    const { user } = this.props;

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
