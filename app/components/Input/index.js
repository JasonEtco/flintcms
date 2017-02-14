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
  }

  static defaultProps = {
    label: null,
    type: 'text',
    placeholder: null,
    big: false,
    full: false,
    onChange: f => f,
    className: null,
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
    const { name, label, type, placeholder, big, full, className } = this.props;

    const classes = classnames(
      'input',
      { 'input--big': big },
      { 'input--full': full },
      className,
    );

    const input = (
      <input
        className={classes}
        type={type}
        name={name}
        placeholder={placeholder}
        onChange={() => this.handleChange()}
        ref={(r) => { this[name] = r; }}
      />
    );

    return !label ? input : (
      <div className="input-wrapper">
        <label className="input__label" htmlFor={name}>{label}</label>
        {input}
      </div>
    );
  }
}

