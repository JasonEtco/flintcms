import React, { Component } from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'

export default class Numeric extends Component {
  static propTypes = {
    label: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    required: PropTypes.bool,
    instructions: PropTypes.string,
    defaultValue: PropTypes.number,
    max: PropTypes.number,
    min: PropTypes.number,
    step: PropTypes.number,
    onChange: PropTypes.func
  }

  static defaultProps = {
    instructions: null,
    defaultValue: null,
    required: false,
    max: null,
    min: null,
    step: null,
    onChange: f => f
  }

  render () {
    const { required, name, max, min, step, defaultValue, instructions, label } = this.props
    const classes = classnames(
      'input-wrapper',
      'form-element',
      { 'form-element--required': required }
    )

    const input = (
      <input
        className='input'
        type='number'
        name={name}
        id={name}
        required={required}
        defaultValue={defaultValue}
        max={max}
        min={min}
        step={step}
        onChange={e => this.props.onChange(e.target.value)}
      />
    )

    return (
      <div className={classes}>
        {label && <label className='input__label' htmlFor={name}>{label}</label>}
        {instructions && <p className='input__instructions'>{instructions}</p>}
        {input}
      </div>
    )
  }
}
