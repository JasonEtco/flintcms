import React, { Component, PropTypes } from 'react';
import Input from '../../Input';

export default class Text extends Component {
  static propTypes = {
    label: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    instructions: PropTypes.string,
    defaultValue: PropTypes.string,
  }

  static defaultProps = {
    instructions: null,
    defaultValue: null,
  }

  render() {
    const { name, label, instructions, defaultValue } = this.props;

    return (
      <Input
        name={name}
        label={label}
        instructions={instructions}
        defaultValue={defaultValue}
        full
      />
    );
  }
}

