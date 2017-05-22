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
    let isActive = props.defaultValue;
    if (typeof props.defaultValue === 'string' && props.defaultValue !== '') {
      isActive = JSON.parse(props.defaultValue);
    }
    this.state = { isActive };
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange() {
    const { isActive } = this.state;
    this.setState({ isActive: !isActive });
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
        <button className="toggle" role="checkbox" aria-checked={isActive} onClick={this.handleChange} type="button">
          <div className="toggle__marker" />
        </button>
        <input name={name} type="checkbox" hidden readOnly value={JSON.stringify(isActive)} checked={isActive} />
      </div>
    );
  }
}
