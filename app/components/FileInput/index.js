import React, { Component, PropTypes } from 'react';
import classnames from 'classnames';
import h from '../../utils/helpers';
import './FileInput.scss';

export default class FileInput extends Component {
  static propTypes = {
    placeholder: PropTypes.string,
    name: PropTypes.string.isRequired,
    label: PropTypes.string,
    big: PropTypes.bool,
    full: PropTypes.bool,
    className: PropTypes.string,
    instructions: PropTypes.string,
    required: PropTypes.bool,
    disabled: PropTypes.bool,
  }

  static defaultProps = {
    label: null,
    placeholder: null,
    big: false,
    full: false,
    className: null,
    instructions: null,
    required: false,
    disabled: false,
  }

  render() {
    const {
      name,
      label,
      placeholder,
      big,
      full,
      className,
      instructions,
      required,
      disabled,
    } = this.props;

    const classes = classnames(
      'file-input-wrapper',
      'form-element',
      { 'file-input-wrapper--big': big },
      { 'file-input-wrapper--full': full },
      { 'file-input-wrapper--required': required },
      { 'file-input-wrapper--disabled': disabled },
      className,
    );

    const input = (
      <input
        className="input"
        type="file"
        name={name}
        id={name}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        ref={(r) => { this[name] = r; }}
        accept="image/*"
      />
    );

    return (
      <div className={classes}>
        {label && <label className="input__label" htmlFor={name}>{label}</label>}
        {instructions && <p className="input__instructions" dangerouslySetInnerHTML={{ __html: h.formatStringWithCode(instructions) }} />}
        {input}
      </div>
    );
  }
}

