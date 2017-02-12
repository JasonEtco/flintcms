import React, { Component, PropTypes } from 'react';
import classnames from 'classnames';
import './Button.scss';

export default class Button extends Component {
  static propTypes = {
    onClick: PropTypes.func,
    type: PropTypes.oneOf(['button', 'submit', 'reset']),
    kind: PropTypes.oneOf(['yes', 'no']),
    disabled: PropTypes.bool,
    children: PropTypes.object.isRequired,
    small: PropTypes.bool,
  }

  static defaultProps = {
    onClick: () => {},
    type: 'button',
    kind: '',
    disabled: false,
    small: false,
  }

  render() {
    const { kind, type, onClick, disabled, children, small, big } = this.props;
    const classes = classnames(
      { [`btn--${kind}`]: kind },
      { 'btn--small': small },
      { 'btn--big': big },
    );

    return (
      <button
        className={classes}
        type={type}
        onClick={onClick}
        disabled={disabled}
      >
        {children}
      </button>
    );
  }
}

