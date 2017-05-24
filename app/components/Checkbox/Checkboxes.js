import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Checkbox from './index';

export default class Checkboxes extends Component {
  static propTypes = {
    name: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    instructions: PropTypes.string,
    checkboxes: PropTypes.arrayOf(PropTypes.object).isRequired,
  }

  static defaultProps = {
    instructions: null,
  }

  render() {
    const { checkboxes, name, label, instructions } = this.props;

    return (
      <div className="checkbox-group form-element">
        <span className="checkbox-group__label">{label}</span>
        {instructions && <p className="input__instructions">{instructions}</p>}
        {checkboxes.map(check => <Checkbox key={check.name} formElement={false} {...check} name={`${name}[${check.name}]`} />)}
      </div>
    );
  }
}
