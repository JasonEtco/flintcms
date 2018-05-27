/* eslint-disable jsx-a11y/no-static-element-interactions */

import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { ChromePicker } from 'react-color'
import classnames from 'classnames'
import './Color.scss'

export default class Color extends Component {
  static propTypes = {
    name: PropTypes.string.isRequired,
    defaultValue: PropTypes.string,
    label: PropTypes.string,
    instructions: PropTypes.string,
    required: PropTypes.bool.isRequired,
    onChange: PropTypes.func
  }

  static defaultProps = {
    defaultValue: '#000000',
    label: null,
    instructions: null,
    onChange: f => f
  }

  static validate (val) {
    return val.length === 7 && val.startsWith('#')
  }

  constructor (props) {
    super(props)

    this.handleToggle = this.handleToggle.bind(this)
    this.hide = this.hide.bind(this)
    this.value = props.defaultValue

    this.state = { open: false, color: props.defaultValue }
  }

  hide () {
    this.setState({ open: false })
  }

  handleToggle (e) {
    e.stopPropagation()
    this.setState({ open: !this.state.open })
  }

  handleChangeComplete = (color) => {
    this.value = color
    this.setState({ color: color.hex })
    this.props.onChange(color.hex)
  };

  render () {
    const { label, instructions, name, required } = this.props
    const { color, open } = this.state

    const classes = classnames(
      'color-wrapper',
      'form-element',
      { 'form-element--required': required }
    )

    return (
      <div className={classes}>
        {label && <span className='input__label'>{label}</span>}
        {instructions && <p className='input__instructions'>{instructions}</p>}
        <button
          onClick={this.handleToggle}
          className='color__btn'
          type='button'
          style={{ backgroundColor: color }}
        />
        <div className={`color__picker ${open ? 'is-open' : ''}`}>
          <div className='color__overlay' onClick={this.hide} />
          <ChromePicker
            color={color}
            onChangeComplete={this.handleChangeComplete}
          />
        </div>

        <input type='text' name={name} value={color} readOnly hidden />
      </div>
    )
  }
}
