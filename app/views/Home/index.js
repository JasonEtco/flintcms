import React, { Component, PropTypes } from 'react';
import Page from '../../containers/Page';

export default class Home extends Component {
  static propTypes = {
    socket: PropTypes.object,
  };

  static defaultProps = {
    socket: {},
  }

  render() {
    return <Page name="home">Home! You are signed in!</Page>;
  }
}
