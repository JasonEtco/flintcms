import React, { Component, PropTypes } from 'react';
import helpers from '../../utils/helpers';

const Cell = ({ column, children }) => <td data-column={column}>{children}</td>;
Cell.propTypes = { children: PropTypes.string, column: PropTypes.string.isRequired };
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
    const sorted = helpers.sortArrayOfObjByString(data, sortBy, direction);

    return (
      <table>
        <thead>
          <tr>
            {columns.map(h => <th onClick={() => this.handleSort(h)} key={h}>{h}{sortBy === h && direction}</th>)}
          </tr>
        </thead>
        <tbody>
          {sorted.map((tr, i) => <tr key={i}>{columns.map(h => <Cell key={tr[h]} column={h}>{tr[h]}</Cell>)}</tr>)}
        </tbody>
      </table>
    );
  }
}
