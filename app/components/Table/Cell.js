import React, { PropTypes } from 'react';
import { truncate } from 'utils/helpers';

const Cell = ({ column, children }) => (
  <td className={`table__cell table__cell--${column}`}>
    {children.component || truncate(children, 20) }
  </td>
);

Cell.propTypes = {
  children: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  column: PropTypes.string.isRequired,
};
Cell.defaultProps = { children: '-' };

export default Cell;
