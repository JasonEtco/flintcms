import React, { Component, PropTypes } from 'react';
import classnames from 'classnames';
import Icon from 'utils/icons';
import './Checkbox.scss';

export default class Checkbox extends Component {
  static propTypes = {
    name: PropTypes.string.isRequired,
    label: PropTypes.string,
    onChange: PropTypes.func,
    className: PropTypes.string,
    instructions: PropTypes.string,
    disabled: PropTypes.bool,
    defaultValue: PropTypes.bool,
    formElement: PropTypes.bool,
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
    formElement: true,
  }

  constructor(props) {
    super(props);
    this.toggle = this.toggle.bind(this);
    this.state = { checked: props.value || props.defaultValue };
    this.value = props.value || props.defaultValue;
  }

  toggle() {
    this.setState({ checked: !this.state.checked }, () => {
      if (this.props.onChange) this.props.onChange(this.state.checked);
      this.value = this.state.checked;
    });
  }

  render() {
    const { checked } = this.state;
    const { disabled, className, label, instructions, name, formElement } = this.props;
    const wrapperClasses = classnames(
      'checkbox-wrapper',
      { 'form-element': formElement },
      { 'checkbox-wrapper--disabled': disabled },
      className,
    );
    const boxClasses = classnames(
      'checkbox',
      { 'is-checked': checked },
    );

    return (
      <div className={wrapperClasses}>
        <button type="button" id={name} role="checkbox" aria-checked={checked} onClick={this.toggle} className={boxClasses}>
          <Icon width={9} height={9} icon="checkmark" />
        </button>
        {label && <label className="input__label" htmlFor={name}>{label}</label>}
        {instructions && <p className="input__instructions">{instructions}</p>}
        <input name={name} type="checkbox" hidden readOnly value={checked} checked={checked} />
      </div>
    );
  }
}
