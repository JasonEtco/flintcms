import React, { Component, PropTypes } from 'react';

export default class Text extends Component {
  static propTypes = {
    placeholder: PropTypes.string,
    name: PropTypes.string.isRequired,
    label: PropTypes.string,
  }

  static defaultProps = {
    label: null,
    placeholder: null,
  }

  render() {
    const { name, label, placeholder } = this.props;

    const input = (
      <input
        className="input"
        type="text"
        name={name}
        placeholder={placeholder}
        ref={(r) => { this[name] = r; }}
      />
    );

    return !label ? input : (
      <div className="input-wrapper form-element">
        <label className="input__label" htmlFor={name}>{label}</label>
        {input}
      </div>
    );
  }
}

