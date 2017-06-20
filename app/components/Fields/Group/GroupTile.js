/* eslint-disable jsx-a11y/no-static-element-interactions */

import React from 'react';
import PropTypes from 'prop-types';
import DeleteIcon from 'components/DeleteIcon';
import store from 'utils/store';

export default function GroupTile({ onClick, label, handle, isActive, onDelete }) {
  const { dispatch } = store;
  return (
    <a
      onClick={onClick}
      className={`panel__col__tile ${isActive ? 'is-active' : ''}`}
    >
      {label}
      {handle && <span className="panel__col__handle">{handle}</span>}
      {onDelete && <DeleteIcon onClick={() => onDelete(label)} dispatch={dispatch} />}
    </a>
  );
}

GroupTile.propTypes = {
  onClick: PropTypes.func.isRequired,
  label: PropTypes.string.isRequired,
  handle: PropTypes.string,
  isActive: PropTypes.bool.isRequired,
  onDelete: PropTypes.func,
};

GroupTile.defaultProps = {
  onDelete: null,
  handle: null,
};
