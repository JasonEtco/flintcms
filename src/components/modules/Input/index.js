import React, { PropTypes } from 'react';
import './Input.scss';

export default function Input({ type, name }) {
  return (
    <input className="input" type={type} name={name} />
  );
}

Input.propTypes = {
  type: PropTypes.oneOf(['text', 'password', 'email']),
  name: PropTypes.string.isRequired,
};

Input.defaultProps = {
  type: 'text',
};
