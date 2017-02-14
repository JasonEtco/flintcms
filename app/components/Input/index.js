import React, { Component, PropTypes } from 'react';
import classnames from 'classnames';
import './Input.scss';

export default class Input extends Component {
  static propTypes = {
    type: PropTypes.oneOf(['text', 'password', 'email']),
    placeholder: PropTypes.string,
    name: PropTypes.string.isRequired,
    label: PropTypes.string,
    big: PropTypes.bool,
    full: PropTypes.bool,
    onChange: PropTypes.func,
    className: PropTypes.string,
    instructions: PropTypes.string,
    required: PropTypes.bool,
    disabled: PropTypes.bool,
    defaultValue: PropTypes.string,
  }

  static defaultProps = {
    label: null,
    type: 'text',
    placeholder: null,
    big: false,
    full: false,
    onChange: f => f,
    className: null,
    instructions: null,
    required: false,
    disabled: false,
    defaultValue: null,
  }

  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange() {
    const { name, onChange } = this.props;
    const { value } = this[name];

    this.value = value;
    onChange(value);
  }

  render() {
    const {
      name,
      label,
      type,
      placeholder,
      big,
      full,
      className,
      instructions,
      required,
      disabled,
      defaultValue,
    } = this.props;

    const classes = classnames(
      'input-wrapper',
      { 'input-wrapper--big': big },
      { 'input-wrapper--full': full },
      { 'input-wrapper--required': required },
      className,
    );

    const input = (
      <input
        className="input"
        type={type}
        name={name}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        defaultValue={defaultValue}
        onChange={() => this.handleChange()}
        ref={(r) => { this[name] = r; }}
      />
    );

    return (
      <div className={classes}>
        {label && <label className="input__label" htmlFor={name}>{label}</label>}
        {instructions && <p className="input__instructions">{instructions}</p>}
        {input}
      </div>
    );
  }
}

