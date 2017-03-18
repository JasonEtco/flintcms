import React, { Component, PropTypes } from 'react';
import classnames from 'classnames';

export default class Checkbox extends Component {
  static propTypes = {
    name: PropTypes.string.isRequired,
    label: PropTypes.string,
    onChange: PropTypes.func,
    className: PropTypes.string,
    instructions: PropTypes.string,
    disabled: PropTypes.bool,
    defaultValue: PropTypes.bool,
    value: PropTypes.bool,
  }

  static defaultProps = {
    label: null,
    onChange: null,
    className: null,
    instructions: null,
    disabled: false,
    defaultValue: false,
    value: null,
  }

  constructor(props) {
    super(props);
    this.toggle = this.toggle.bind(this);
    this.state = { checked: props.value || props.defaultValue };
  }

  toggle() {
    this.setState({ checked: !this.state.checked });
  }

  render() {
    const { checked } = this.state;
    const { disabled, className, label, instructions, name } = this.props;
    const classes = classnames(
      'checkbox-wrapper',
      'form-element',
      { 'checkbox-wrapper--disabled': disabled },
      className,
    );

    return (
      <div className={classes}>
        {label && <label className="input__label" htmlFor={name}>{label}</label>}
        {instructions && <p className="input__instructions">{instructions}</p>}
        <button onClick={this.toggle}>{checked ? 'Yes' : 'No'}</button>
        hi!
      </div>
    );
  }
}
