import React, { Component, PropTypes } from 'react';
import './Aside.scss';

export default class Aside extends Component {
  static propTypes = {
    children: PropTypes.any.isRequired,
  }

  render() {
    return (
      <aside className="aside">
        {this.props.children}
      </aside>
    );
  }
}
