import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

const DayTile = ({ day, isActive, disabled, onClick }) => {
  const classes = classnames(
    'datepicker__date',
    { 'is-active': isActive },
    { 'is-disabled': disabled },
  );

  return (
    <button
      type="button"
      disabled={disabled}
      className={classes}
      onClick={onClick}
    >
      {day}
    </button>
  );
};

DayTile.propTypes = {
  day: PropTypes.number.isRequired,
  isActive: PropTypes.bool.isRequired,
  disabled: PropTypes.bool,
  onClick: PropTypes.func,
};

DayTile.defaultProps = {
  disabled: false,
  onClick: null,
};

export default DayTile;
