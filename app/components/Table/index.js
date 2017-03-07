import React, { Component, PropTypes } from 'react';
import classnames from 'classnames';
import h from '../../utils/helpers';
import p from '../../utils/prettyNames';
import Input from '../Input';
import './Table.scss';

const Cell = ({ column, children }) => (
  <td className={`table__cell table__cell--${column}`}>
    {children.component || children }
  </td>
);

Cell.propTypes = {
  children: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  column: PropTypes.string.isRequired,
};
Cell.defaultProps = { children: '-' };

export default class Table extends Component {
  static propTypes = {
    data: PropTypes.arrayOf((propValue, key, componentName, location, propName) => {
      const msg = `Invalid prop  \`${propName}\` supplied to \`${componentName}\`.`;
      if (typeof propValue !== 'object') {
        return new Error(`${msg} Must be an array of objects.`);
      }
      if (!Object.prototype.hasOwnProperty.call(propValue[key], 'key')) {
        return new Error(`${msg} Needs a "key" prop.`);
      }
      return true;
    }).isRequired,
    showSearch: PropTypes.bool,
    sortBy: PropTypes.string,
  }

  static defaultProps = {
    showSearch: true,
    sortBy: 'title',
  }

  constructor(props) {
    super(props);

    this.handleSort = this.handleSort.bind(this);
    this.handleChange = this.handleChange.bind(this);

    this.state = { sortBy: props.sortBy, direction: 'DESC', search: '' };
  }


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
        Object.keys(t).forEach((prop) => {
          if ((typeof t[prop] === 'string' && t[prop].search(re) > -1)
           || (typeof t[prop] === 'object' && t[prop].value.search(re) > -1)) return true;
          return false;
        });
        return false;
      });
    }

    const columns = filtered
      .reduce((prev, curr) => [...prev, ...Object.keys(curr)], [])
      .filter((el, i, self) => i === self.indexOf(el))
      .filter(el => el !== 'key');

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

                const first = data.find(c => c[column]);
                const has = typeof first[column].sortBy === 'boolean' && first[column].sortBy === false;

                if (has) return <th key={column} />;
                return (
                  <th className="table__header" key={column}>
                    <button
                      className={btnClass}
                      onClick={() => this.handleSort(column)}
                    >{p[column] || column}</button>
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {sorted.map(tr =>
              <tr className="table__row" key={tr.key}>{columns.map(column =>
                <Cell key={column} column={column}>{tr[column]}</Cell>)}
              </tr>)}
          </tbody>
        </table>
      </div>
    );
  }
}
