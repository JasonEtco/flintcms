import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { get } from 'axios'
import { Link } from 'react-router-dom'
import Icon from 'utils/icons'
import t from 'utils/types'
import Avatar from 'components/Avatar'
import './MainNav.scss'

const NavItem = ({ to, icon, children }) => (
  <li className='nav__list-item'>
    <Link className='nav__list-item__link' to={to}>
      <Icon icon={icon} />
      {children}
    </Link>
  </li>)

NavItem.propTypes = {
  to: PropTypes.string.isRequired,
  icon: PropTypes.string.isRequired,
  children: PropTypes.string.isRequired
}

export default class MainNav extends Component {
  static propTypes = {
    siteName: PropTypes.string,
    user: t.user.isRequired,
    open: PropTypes.bool.isRequired
  }

  static defaultProps = {
    siteName: 'Example Flint Site'
  }

  state = { hasUpdate: false }

  componentDidMount () {
    get('/admin/api/hasUpdate').then((res) => {
      this.setState({ hasUpdate: res.data.hasUpdate })
    })
  }

  render () {
    const { user, open } = this.props
    const { hasUpdate } = this.state

    const perms = user.usergroup.permissions
    const showSection = obj => obj && Object.keys(obj).some(v => obj[v])

    const showSettings =
      showSection(perms.sections) ||
      showSection(perms.fields) ||
      showSection(perms.assets) ||
      showSection(perms.users) ||
      perms.site.canManageSite ||
      perms.site.canCustomStyles ||
      perms.site.canManagePlugins

    const links = [
      { to: '/', icon: 'home', children: 'Home' },
      { to: '/pages', icon: 'fileText', children: 'Pages' },
      { to: '/entries', icon: 'newspaper', children: 'Entries' },
      { to: '/users', icon: 'user', children: 'Users' },
      { to: '/settings', icon: 'gear', children: 'Settings', hidden: !showSettings }
    ]

    return (
      <nav className={`nav ${open ? 'is-open' : ''}`}>
        <a href='/' target='_blank' rel='noopener noreferrer' className='nav__sitename'>
          {this.props.siteName}
        </a>

        {hasUpdate && (
          <a className='nav__hasUpdate' href='https://github.com/JasonEtco/flintcms/blob/master/CHANGELOG.md' target='_blank' rel='noopener noreferrer'>
            <svg className='nav__hasUpdate__icon' xmlns='http://www.w3.org/2000/svg' width='32' height='32' viewBox='0 0 16 16'><path d='M9.14.51h0a1.55,1.55,0,0,0,1.61.43h0a1.55,1.55,0,0,1,2,1.14h0a1.55,1.55,0,0,0,1.18,1.18h0a1.55,1.55,0,0,1,1.14,2h0a1.55,1.55,0,0,0,.43,1.61h0a1.55,1.55,0,0,1,0,2.29h0a1.55,1.55,0,0,0-.43,1.61h0a1.55,1.55,0,0,1-1.14,2h0a1.55,1.55,0,0,0-1.18,1.18h0a1.55,1.55,0,0,1-2,1.14h0a1.55,1.55,0,0,0-1.61.43h0a1.55,1.55,0,0,1-2.29,0h0a1.55,1.55,0,0,0-1.61-.43h0a1.55,1.55,0,0,1-2-1.14h0a1.55,1.55,0,0,0-1.18-1.18h0a1.55,1.55,0,0,1-1.14-2h0A1.55,1.55,0,0,0,.51,9.14h0a1.55,1.55,0,0,1,0-2.29h0A1.55,1.55,0,0,0,.94,5.24h0a1.55,1.55,0,0,1,1.14-2h0A1.55,1.55,0,0,0,3.26,2.08h0a1.55,1.55,0,0,1,2-1.14h0A1.55,1.55,0,0,0,6.86.51h0A1.55,1.55,0,0,1,9.14.51Z' transform='translate(0 0)' style={{ fill: '#fe6300' }} /><path d='M12.75,10.66c0-2.66-2.37-2.07-2.37-4.14a1.89,1.89,0,0,0,0-.44A2.56,2.56,0,0,0,8.58,3.94a.51.51,0,0,0,0-.11.59.59,0,0,0-1.18,0,.51.51,0,0,0,0,.11A2.62,2.62,0,0,0,5.64,6.47v.05c0,2.07-2.37,1.48-2.37,4.14,0,.7,1.58,1.29,3.69,1.44A1.18,1.18,0,0,0,9,12.1c2.11-.15,3.69-.74,3.69-1.44h0Zm-1.84.5a10.09,10.09,0,0,1-1.73.28,1.18,1.18,0,0,0-2.36,0,10.09,10.09,0,0,1-1.73-.28A2.9,2.9,0,0,1,4,10.66a2.9,2.9,0,0,1,1.14-.5A11.71,11.71,0,0,1,8,9.83a11.71,11.71,0,0,1,2.9.33,2.9,2.9,0,0,1,1.14.5A2.9,2.9,0,0,1,10.91,11.16Z' transform='translate(0 0)' style={{ fill: '#fff' }} /></svg>
            <span className='nav__hasUpdate__tooltip'>
              There is an update available!
            </span>
          </a>
        )}

        <ul className='nav__list'>
          {links.filter(link => !link.hidden).map(link => <NavItem key={link.to} {...link} />)}
        </ul>

        <div className='nav__user'>
          <div className='nav__user__avatar'>
            <Avatar user={user} />
          </div>
          <div className='nav__user__text'>
            <Link className='nav__user__text__title' to={`/users/${user._id}`}>Hey {user.name ? user.name.first : user.username}!</Link>
            <a className='nav__user__text__logout' href='/admin/logout'>Logout</a>
          </div>
        </div>
      </nav>
    )
  }
}
