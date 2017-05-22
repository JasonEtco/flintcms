import React, { PropTypes } from 'react';
import DeleteIcon from 'components/DeleteIcon';

export default function GroupTile({ onClick, label, dispatch, isActive, onDelete }) {
  return (
    <a
      onClick={onClick}
      className={`panel__col__tile ${isActive ? 'is-active' : ''}`}
    >
      {label}
      {onDelete && <DeleteIcon onClick={() => onDelete(label)} dispatch={dispatch} />}
    </a>
  );
}

GroupTile.propTypes = {
  onClick: PropTypes.func.isRequired,
  label: PropTypes.string.isRequired,
  isActive: PropTypes.bool.isRequired,
  onDelete: PropTypes.func,
  dispatch: PropTypes.func,
};

GroupTile.defaultProps = {
  onDelete: null,
  dispatch: null,
};
