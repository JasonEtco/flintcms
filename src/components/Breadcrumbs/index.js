import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';

export default class Breadcrumbs extends Component {
  static propTypes = {
    links: PropTypes.arrayOf(PropTypes.shape({
      label: PropTypes.string.isRequired,
      path: PropTypes.string.isRequired,
    })).isRequired,
  };

  render() {
    const { links } = this.props;
    return (
      <nav className="breadcrumbs">
        <ul className="breadcrumbs__list">
          {links.map((l, i, arr) => {
            const isLast = i === arr.length - 1;
            return (
              <li className="breadcrumbs__list-item">
                <Link to={l.path}>{l.label}</Link>
                {!isLast && '>>'}
              </li>
            );
          })}
        </ul>
      </nav>
    );
  }
}
