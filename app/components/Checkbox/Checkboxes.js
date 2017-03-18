import React, { Component, PropTypes } from 'react';
import Checkbox from './index';

export default class Checkboxes extends Component {
  static propTypes = {
    name: PropTypes.string.isRequired,
    checkboxes: PropTypes.arrayOf(PropTypes.object).isRequired,
  }

  render() {
    const { checkboxes, name } = this.props;

    return (
      <div>
        {checkboxes.map(check => <Checkbox key={check.name} {...check} name={`${name}[${check.name}]`} />)}
      </div>
    );
  }
}
