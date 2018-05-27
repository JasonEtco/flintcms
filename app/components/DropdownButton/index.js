import React, { Component } from 'react'
import classnames from 'classnames'
import { arrayOf, shape, string } from 'prop-types'
import { Link } from 'react-router-dom'
import './DropdownButtons.scss'

export default class DropdownButton extends Component {
  static propTypes = {
    links: arrayOf(shape({
      to: string.isRequired,
      label: string.isRequired
    })).isRequired,
    children: string.isRequired
  }

  constructor (props) {
    super(props)
    this.hide = this.hide.bind(this)
    this.handleToggle = this.handleToggle.bind(this)
  }

  state = { open: false }

  componentDidMount () { window.addEventListener('click', this.hide) }
  componentWillUnmount () { window.removeEventListener('click', this.hide) }

  hide () {
    this.setState({ open: false })
  }

  handleToggle (e) {
    e.stopPropagation()
    this.setState({ open: !this.state.open })
  }

  render () {
    const { links, children } = this.props
    const { open } = this.state

    const classes = classnames(
      'dropdown',
      'dropdown-btn',
      { 'is-open': open }
    )

    const dropper = (
      <div className={classes} role='listbox' aria-expanded={open} aria-label={children}>
        <button
          className='btn dropdown__btn dropdown-btn__btn'
          type='button'
          onClick={this.handleToggle}
        >{children}</button>

        <div className='dropdown__options dropdown-btn__options'>
          {links.map(({ to, label }) => (
            <Link
              key={to}
              to={to}
              className='dropdown-btn__opt'
            >{label}</Link>
          ))}
        </div>
      </div>
    )

    return (
      <div className='dropdown-wrapper'>
        {<div className='dropdown__inner'>{dropper}</div>}
      </div>
    )
  }
}
