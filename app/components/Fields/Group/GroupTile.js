/* eslint-disable jsx-a11y/no-static-element-interactions */

import React, { PropTypes } from 'react';
import DeleteIcon from 'components/DeleteIcon';

export default function GroupTile({ onClick, label, handle, dispatch, isActive, onDelete }) {
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
  dispatch: PropTypes.func,
};

GroupTile.defaultProps = {
  onDelete: null,
  handle: null,
  dispatch: null,
};
