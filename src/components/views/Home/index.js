import React, { Component, PropTypes } from 'react';

export default class Home extends Component {
  static propTypes = {
    socket: PropTypes.object.isRequired,
  };

  render() {
    return <div>Home!</div>;
  }
}
