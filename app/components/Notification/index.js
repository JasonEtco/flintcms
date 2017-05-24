import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import Icon from 'utils/icons';
import './Notification.scss';

export default function Notification({ type, children, formElement }) {
  const classes = classnames(
    'notification',
    `notification--${type}`,
    { 'form-element': formElement },
  );

  const icons = {
    warning: 'breakLink',
    error: 'cross',
    success: 'checkmark',
  };

  return (
    <div className={classes}>
      <Icon width={12} height={12} icon={icons[type]} />
      {children}
    </div>
  );
}

Notification.propTypes = {
  type: PropTypes.oneOf(['warning', 'error', 'success']),
  children: PropTypes.oneOfType([PropTypes.string, PropTypes.element]).isRequired,
  formElement: PropTypes.bool,
};

Notification.defaultProps = {
  type: 'warning',
  formElement: true,
};

