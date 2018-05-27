import React from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'
import p from 'utils/prettyNames'
import { truncate } from 'utils/helpers'

const THead = ({ sortBy, column, direction, has, onClick, shouldTruncate }) => {
  const btnClass = classnames(
    'table__header__btn',
    { 'is-active': sortBy === column },
    { desc: sortBy === column && direction === 'DESC' },
    { asc: sortBy === column && direction === 'ASC' }
  )

  const label = p[column] || column

  if (has) return <th key={column} />
  return (
    <th className='table__header' key={column}>
      <button
        className={btnClass}
        onClick={onClick}
      >{shouldTruncate ? truncate(label) : label}</button>
    </th>
  )
}

THead.propTypes = {
  sortBy: PropTypes.string.isRequired,
  column: PropTypes.string.isRequired,
  direction: PropTypes.oneOf(['ASC', 'DESC']).isRequired,
  has: PropTypes.bool.isRequired,
  onClick: PropTypes.func.isRequired,
  shouldTruncate: PropTypes.bool.isRequired
}

export default THead
