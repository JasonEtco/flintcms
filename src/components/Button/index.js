import React, { PropTypes } from 'react';
import './Button.scss';

const Button = props => (
  <button
    className={props.kind ? `btn btn--${props.kind}` : 'btn'}
    type={props.type}
    onClick={props.onClick}
    disabled={props.disabled}
  >
    {props.children}
  </button>
);

Button.defaultProps = {
  onClick: () => {},
  type: 'button',
  kind: '',
  disabled: false,
};

Button.propTypes = {
  onClick: PropTypes.func,
  type: PropTypes.oneOf(['button', 'submit', 'reset']),
  kind: PropTypes.oneOf(['yes', 'no']),
  disabled: PropTypes.bool,
  children: PropTypes.object.isRequired,
};

export default Button;
