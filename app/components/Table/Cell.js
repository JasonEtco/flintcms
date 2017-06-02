import React from 'react';
import PropTypes from 'prop-types';
import { truncate } from 'utils/helpers';

const Cell = ({ column, children }) => (
  <td className={`table__cell table__cell--${column}`}>
    {typeof children === 'string' ? truncate(children, 20) : children.component}
  </td>
);

Cell.propTypes = {
  children: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  column: PropTypes.string.isRequired,
};
Cell.defaultProps = { children: '-' };

export default Cell;
