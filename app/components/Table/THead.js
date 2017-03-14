import React, { PropTypes } from 'react';
import classnames from 'classnames';
import p from '../../utils/prettyNames';

const THead = ({ sortBy, column, direction, has, onClick }) => {
  const btnClass = classnames(
    'table__header__btn',
    { 'is-active': sortBy === column },
    { desc: sortBy === column && direction === 'DESC' },
    { asc: sortBy === column && direction === 'ASC' },
  );

  if (has) return <th key={column} />;
  return (
    <th className="table__header" key={column}>
      <button
        className={btnClass}
        onClick={onClick}
      >{p[column] || column}</button>
    </th>
  );
};

THead.propTypes = {
  sortBy: PropTypes.string.isRequired,
  column: PropTypes.string.isRequired,
  direction: PropTypes.oneOf(['ASC', 'DESC']).isRequired,
  has: PropTypes.bool.isRequired,
  onClick: PropTypes.func.isRequired,
};

export default THead;

