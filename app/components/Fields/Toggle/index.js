import React, { Component, PropTypes } from 'react';
import classnames from 'classnames';
import './Toggle.scss';

export default class Toggle extends Component {
  static propTypes = {
    label: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    instructions: PropTypes.string,
    defaultValue: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]),
  }

  static defaultProps = {
    instructions: null,
    defaultValue: false,
  }

  constructor(props) {
    super(props);
    this.state = { isActive: typeof props.defaultValue === 'string' ? JSON.parse(props.defaultValue) : props.defaultValue };
  }

  render() {
    const { instructions, label, name } = this.props;
    const { isActive } = this.state;

    const classes = classnames(
      'toggle-wrapper',
      'form-element',
      { 'is-active': isActive },
    );

    return (
      <div className={classes}>
        {label && <label className="input__label" htmlFor={name}>{label}</label>}
        {instructions && <p className="input__instructions">{instructions}</p>}
        <button className="toggle" role="checkbox" aria-checked={isActive} onClick={() => this.setState({ isActive: !isActive })} type="button">
          <div className="toggle__marker" />
        </button>
        <input name={name} type="checkbox" hidden readOnly value={isActive} checked={isActive} />
      </div>
    );
  }
}
