import React, { Component, PropTypes } from 'react';
import classnames from 'classnames';
import moment from 'moment';
import h from '../../utils/helpers';
import p from '../../utils/prettyNames';
import Input from '../Input';
import './Table.scss';

const Cell = ({ column, children }) => {
  let content;
  if (h.isDate(children)) {
    content = moment(children).format('DD/MM/YYYY');
  } else if (children.value && children.component) {
    content = children.component;
  } else {
    content = children;
  }

  return (
    <td className={`table__cell table__cell--${column}`}>
      {content}
    </td>
  );
};

Cell.propTypes = {
  children: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  column: PropTypes.string.isRequired,
};
Cell.defaultProps = { children: '-' };

export default class Table extends Component {
  static propTypes = {
    data: PropTypes.array.isRequired,
    showSearch: PropTypes.bool,
  }

  static defaultProps = {
    showSearch: true,
  }

  constructor(props) {
    super(props);

    this.handleSort = this.handleSort.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  state = { sortBy: 'title', direction: 'ASC', search: '' }

  handleSort(sortBy) {
    if (sortBy === this.state.sortBy) {
      this.setState({ direction: this.state.direction === 'ASC' ? 'DESC' : 'ASC' });
    }
    this.setState({ sortBy });
  }

  handleChange(search) {
    this.setState({ search });
  }

  render() {
    const { data, showSearch } = this.props;
    const { sortBy, direction, search } = this.state;

    let filtered = data;
    if (search !== '' && showSearch) {
      filtered = data.filter((t) => {
        const re = new RegExp(search.replace(/[/\\^$*+?()|[\]]/g, '\\$&'), 'i');
        for (const prop in t) {
          if (typeof t[prop] === 'string' && t[prop].search(re) > -1) return true;
          if (typeof t[prop] === 'object' && t[prop].value.search(re) > -1) return true;
        }
        return false;
      });
    }

    const columns = filtered
      .reduce((prev, curr) => [...prev, ...Object.keys(curr)], [])
      .filter((el, i, self) => i === self.indexOf(el));

    const sorted = h.sortArrayOfObjByString(filtered, sortBy, direction);

    return (
      <div className="table-wrapper">
        {showSearch &&
          <Input
            onChange={this.handleChange}
            ref={(r) => { this.search = r; }}
            placeholder="Search"
            full
            name="search"
            className="table__search"
          />
        }
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
      </div>
    );
  }
}
