import React, { Component, PropTypes } from 'react';
import { ChromePicker } from 'react-color';

export default class Color extends Component {
  static propTypes = {
    value: PropTypes.string,
  }

  static defaultProps = {
    value: '#000000',
  }

  constructor(props) {
    super(props);
    this.state = { color: props.value };
  }

  handleChangeComplete = (color) => {
    this.setState({ color: color.hex });
  };

  render() {
    return (
      <ChromePicker
        color={this.state.color}
        onChangeComplete={this.handleChangeComplete}
      />
    );
  }
}
