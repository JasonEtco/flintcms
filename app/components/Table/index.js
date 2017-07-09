/* eslint-disable jsx-a11y/no-static-element-interactions */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { sortArrayOfObjByString } from 'utils/helpers';
import Input from 'components/Input';
import './Table.scss';

import THead from './THead';
import Cell from './Cell';


export default class Table extends Component {
  static propTypes = {
    data: PropTypes.arrayOf((propValue, key, componentName, location, propName) => {
      const msg = `Invalid prop \`${propName}\` supplied to \`${componentName}\`.`;
      if (typeof propValue !== 'object') {
        return new Error(`${msg} Must be an array of objects.`);
      }
      if (!Object.prototype.hasOwnProperty.call(propValue[key], 'key')) {
        return new Error(`${msg} Needs a "key" prop.`);
      }
      return true;
    }).isRequired,
    showSearch: PropTypes.bool,
    formElement: PropTypes.bool,
    sortBy: PropTypes.string,
    className: PropTypes.string,
    onRowClick: PropTypes.func,
  }

  static defaultProps = {
    showSearch: true,
    sortBy: 'title',
    className: '',
    onRowClick: null,
    formElement: false,
  }

  constructor(props) {
    super(props);

    this.handleSort = this.handleSort.bind(this);
    this.handleRowClick = this.handleRowClick.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.filterer = this.filterer.bind(this);
    this.handleResize = this.handleResize.bind(this);
    this.state = { sortBy: props.sortBy, direction: 'DESC', search: '', shouldTruncate: this.shouldTruncate };
  }

  componentDidMount() { window.addEventListener('resize', this.handleResize); }
  componentWillUnmount() { window.removeEventListener('resize', this.handleResize); }

  // eslint-disable-next-line class-methods-use-this
  get shouldTruncate() { return window.innerWidth <= 768; }

  handleResize() {
    this.setState({ shouldTruncate: this.shouldTruncate });
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

  filterer(row) {
    const { search } = this.state;
    const re = new RegExp(search.replace(/[/\\^$*+?()|[\]]/g, '\\$&'), 'i');

    let flag = false;
    Object.keys(row).forEach((key) => {
      const v = row[key];
      if (v !== null && typeof v === 'object' && v.sortBy !== false && v.value !== undefined && v.value.toString().search(re) !== -1) flag = true;
      if (v.toString().search(re) !== -1) flag = true;
    });
    return flag;
  }

  handleRowClick(key) {
    const { onRowClick } = this.props;
    if (onRowClick) onRowClick(key);
  }

  render() {
    const { data, showSearch, className, formElement } = this.props;
    const { sortBy, direction, search, shouldTruncate } = this.state;

    let filtered = data;
    if (search !== '' && showSearch) {
      filtered = data.filter(this.filterer);
    }

    const columns = filtered
      .reduce((prev, curr) => [...prev, ...Object.keys(curr)], [])
      .filter((el, i, self) =>
        i === self.indexOf(el) &&
        el !== 'key' &&
        data.find(c => Object.hasOwnProperty.call(c, el))[el]);

    const sorted = sortArrayOfObjByString(filtered, sortBy, direction);
    const classes = classnames(
      'table-wrapper',
      { 'form-element': formElement },
    );

    return (
      <div className={classes}>
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
        <table className={`table ${className}`}>
          <thead>
            <tr className="table__row">
              {columns.map((column) => {
                const first = data.find(c => c[column]);
                const has = first[column] && typeof first[column].sortBy === 'boolean' && first[column].sortBy === false;

                return (
                  <THead
                    key={column}
                    sortBy={sortBy}
                    column={column}
                    direction={direction}
                    has={has}
                    onClick={() => this.handleSort(column)}
                    shouldTruncate={shouldTruncate}
                  />
                );
              })}
            </tr>
          </thead>
          <tbody>
            {sorted.map(tr => (
              <tr className="table__row" key={tr.key} onClick={() => this.handleRowClick(tr.key)}>{columns.map(column =>
                <Cell key={column} column={column}>{tr[column]}</Cell>)}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }
}
