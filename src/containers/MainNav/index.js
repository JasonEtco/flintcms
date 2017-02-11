import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';
import FlintLogo from '../../components/FlintLogo';
import Icon from '../../utils/icons';
import './MainNav.scss';

const NavItem = props => <li className="nav__list-item"><Link className="nav__list-item__link" to={props.to}>{props.children}</Link></li>;

NavItem.propTypes = {
  to: PropTypes.string.isRequired,
  children: PropTypes.array.isRequired,
};

export default class MainNav extends Component {
  render() {
    return (
      <nav className="nav">
        <FlintLogo />
        <ul className="nav__list">
          <NavItem to="/admin"><Icon icon="checkmark" />Home</NavItem>
          <NavItem to="/admin/entries"><Icon icon="checkmark" />Entries</NavItem>
          <NavItem to="/admin/newsection"><Icon icon="checkmark" />New Section</NavItem>
        </ul>
      </nav>
    );
  }
}
