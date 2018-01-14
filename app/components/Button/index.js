import React, { Component } from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'
import './Button.scss'

export default class Button extends Component {
  static propTypes = {
    onClick: PropTypes.func,
    type: PropTypes.oneOf(['button', 'submit', 'reset']),
    kind: PropTypes.oneOf(['yes', 'no', 'subtle']),
    disabled: PropTypes.bool,
    children: PropTypes.oneOfType([PropTypes.object, PropTypes.string]).isRequired,
    small: PropTypes.bool,
    big: PropTypes.bool,
    formElement: PropTypes.bool,
    className: PropTypes.string
  }

  static defaultProps = {
    onClick: () => {},
    type: 'button',
    kind: null,
    disabled: false,
    small: false,
    big: false,
    formElement: false,
    className: null
  }

  render () {
    const {
      kind,
      type,
      onClick,
      disabled,
      children,
      small,
      big,
      formElement,
      className
    } = this.props

    const classes = classnames(
      'btn',
      { [`btn--${kind}`]: kind },
      { 'btn--small': small },
      { 'btn--big': big },
      { 'form-element': formElement },
      className
    )

    if (type === 'submit') {
      return <input type='submit' disabled={disabled} className={classes} value={children} />
    }

    return (
      <button
        className={classes}
        type={type}
        onClick={onClick}
        disabled={disabled}
      >
        {children}
      </button>
    )
  }
}
