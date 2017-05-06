import React, { Component, PropTypes } from 'react';
import classnames from 'classnames';
import { formatStringWithCode } from 'utils/helpers';
import './Input.scss';

export default class Input extends Component {
  static propTypes = {
    type: PropTypes.oneOf(['text', 'password', 'email']),
    placeholder: PropTypes.string,
    name: PropTypes.string.isRequired,
    label: PropTypes.string,
    big: PropTypes.bool,
    full: PropTypes.bool,
    code: PropTypes.bool,
    onChange: PropTypes.func,
    className: PropTypes.string,
    instructions: PropTypes.string,
    required: PropTypes.bool,
    autoFocus: PropTypes.bool,
    autoCorrect: PropTypes.bool,
    disabled: PropTypes.bool,
    defaultValue: PropTypes.string,
    value: PropTypes.string,
    maxLength: PropTypes.number,
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
    code: false,
    disabled: false,
    defaultValue: undefined,
    value: undefined,
    autoFocus: false,
    autoCorrect: false,
    maxLength: null,
  }

  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);

    const value = props.value || props.defaultValue || '';
    this.value = value;
    this.state = { value };
  }

  handleChange({ target }) {
    const { onChange } = this.props;
    const { value } = target;

    this.value = value;
    this.setState({ value });
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
      code,
      className,
      instructions,
      required,
      disabled,
      defaultValue,
      value,
      autoFocus,
      autoCorrect,
      maxLength,
    } = this.props;

    const classes = classnames(
      'input-wrapper',
      'form-element',
      { 'form-element--required': required },
      { 'input-wrapper--big': big },
      { 'input-wrapper--full': full },
      { 'input-wrapper--code': code },
      { 'input-wrapper--disabled': disabled },
      className,
    );

    const input = (
      <input
        className="input"
        type={type}
        name={name}
        id={name}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        defaultValue={defaultValue}
        autoFocus={autoFocus}
        value={value}
        onChange={event => this.handleChange(event)}
        autoCorrect={autoCorrect}
        maxLength={maxLength}
      />
    );

    return (
      <div className={classes}>
        {label && <label className="input__label" htmlFor={name}>{label}</label>}
        {instructions &&
          <p className="input__instructions" dangerouslySetInnerHTML={{ __html: formatStringWithCode(instructions) }} />  // eslint-disable-line react/no-danger
        }
        {input}
        {maxLength && <span className="input__max">{this.state.value.length}/{maxLength} characters</span>}
      </div>
    );
  }
}

