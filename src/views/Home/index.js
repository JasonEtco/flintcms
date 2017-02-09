import React, { Component, PropTypes } from 'react';

export default class Home extends Component {
  static propTypes = {
    socket: PropTypes.object,
  };

  static defaultProps = {
    socket: {},
  }

  render() {
    return <div>Home! You are signed in!</div>;
  }
}
