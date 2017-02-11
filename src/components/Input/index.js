import React, { Component, PropTypes } from 'react';
import './Input.scss';

export default class Input extends Component {
  static propTypes = {
    type: PropTypes.oneOf(['text', 'password', 'email']),
    placeholder: PropTypes.string,
    name: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    big: PropTypes.bool,
  }

  static defaultProps = {
    type: 'text',
    placeholder: null,
    big: false,
  }

  render() {
    const { name, label, type, placeholder, big } = this.props;

    if (!label) {
      return <input className={`input ${big && 'input--big'}`} type={type} name={name} placeholder={placeholder} />;
    }

    return (
      <div className="input-wrapper">
        <label className="input__label" htmlFor={name}>{label}</label>
        <input className={`input ${big && 'input--big'}`} type={type} name={name} id={name} />
      </div>
    );
  }
}

