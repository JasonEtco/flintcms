import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import './Breadcrumbs.scss'

export default class Breadcrumbs extends Component {
  static propTypes = {
    links: PropTypes.arrayOf(PropTypes.shape({
      label: PropTypes.string.isRequired,
      path: PropTypes.string.isRequired
    })).isRequired
  };

  render () {
    const { links } = this.props
    return (
      <nav className='breadcrumbs'>
        <ul className='breadcrumbs__list'>
          {links.map((l, i, arr) => {
            const isLast = i === arr.length - 1
            return (
              <li className='breadcrumbs__list-item' key={l.path}>
                <Link to={l.path}>{l.label}</Link>
                {!isLast && <span className='breadcrumbs__list-item__separator'>&rsaquo;</span>}
              </li>
            )
          })}
        </ul>
      </nav>
    )
  }
}
