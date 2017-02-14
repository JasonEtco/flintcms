import React, { Component, PropTypes } from 'react';
import classnames from 'classnames';
import moment from 'moment';
import h from '../../utils/helpers';
import p from '../../utils/prettyNames';
import './Table.scss';

const Cell = ({ column, children }) => <td className={`table__cell table__cell--${column}`}>{h.isDate(children) ? moment(children).format('DD/MM/YYYY') : children}</td>;
Cell.propTypes = { children: PropTypes.oneOfType([PropTypes.string, PropTypes.object]), column: PropTypes.string.isRequired };
Cell.defaultProps = { children: '-' };

export default class Table extends Component {
  static propTypes = {
    data: PropTypes.array.isRequired,
  }

  constructor(props) {
    super(props);

    this.handleSort = this.handleSort.bind(this);
  }

  state = { sortBy: 'title', direction: 'ASC' }

  handleSort(sortBy) {
    if (sortBy === this.state.sortBy) {
      this.setState({ direction: this.state.direction === 'ASC' ? 'DESC' : 'ASC' });
    }
    this.setState({ sortBy });
  }

  render() {
    const { data } = this.props;
    const columns = data
      .reduce((prev, curr) => [...prev, ...Object.keys(curr)], [])
      .filter((el, i, self) => i === self.indexOf(el));

    const { sortBy, direction } = this.state;
    const sorted = h.sortArrayOfObjByString(data, sortBy, direction);

    return (
      <table className="table">
        <thead>
          <tr className="table__row">
            {columns.map((column) => {
              const btnClass = classnames(
                'table__header__btn',
                { 'is-active': sortBy === column },
                { desc: sortBy === column && direction === 'DESC' },
                { asc: sortBy === column && direction === 'ASC' },
              );

              return (
                <th className="table__header" key={column}>
                  <button
                    className={btnClass}
                    onClick={() => this.handleSort(column)}
                  >
                    {p[column]}
                  </button>
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody>
          {sorted.map((tr, i) =>
            <tr className="table__row" key={i}>{columns.map(column =>
              <Cell key={tr[column]} column={column}>{tr[column]}</Cell>)}
            </tr>)}
        </tbody>
      </table>
    );
  }
}
