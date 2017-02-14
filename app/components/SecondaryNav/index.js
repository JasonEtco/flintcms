import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';
import './SecondaryNav.scss';

const NavItem = props => <li className="secondary-nav__list-item"><Link activeClassName="is-active" to={props.to}>{props.children}</Link></li>;

NavItem.propTypes = {
  to: PropTypes.string.isRequired,
  children: PropTypes.string.isRequired,
};

export default class SecondaryNav extends Component {
  static propTypes = {
    links: PropTypes.arrayOf(PropTypes.shape({
      label: PropTypes.string.isRequired,
      path: PropTypes.string.isRequired,
    })).isRequired,
    children: PropTypes.element,
  }

  static defaultProps = {
    children: null,
  }

  render() {
    const { links, children } = this.props;

    return (
      <nav className="secondary-nav">
        <ul className="secondary-nav__list">
          <li className="secondary-nav__list-item">{children}</li>
          {links.map(link => <NavItem key={link.path} to={link.path}>{link.label}</NavItem>)}
        </ul>
      </nav>
    );
  }
}
