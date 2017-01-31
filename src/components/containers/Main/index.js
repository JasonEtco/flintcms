import React, { Component, PropTypes } from 'react';

export default class Main extends Component {
  static propTypes = {
    socket: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired,
    children: PropTypes.object.isRequired,
  };

  render() {
    return (
      <div>
        Main!
        <div>
          {React.cloneElement(this.props.children, {
            ...this.props,
            key: this.props.location.pathname,
          })}
        </div>
      </div>
    );
  }
}
