import React, { Component, PropTypes } from 'react';
import './Page.scss';

export default class Page extends Component {
  static propTypes = {
    children: React.PropTypes.oneOfType([
      React.PropTypes.arrayOf(React.PropTypes.node),
      React.PropTypes.node,
    ]),
    name: PropTypes.string.isRequired,
  };

  static defaultProps = {
    children: null,
  };

  render() {
    const { name, children } = this.props;
    const hasBreadcrumbs = React.Children
      .toArray(children)
      .some(child => child.type && child.type.displayName === 'Breadcrumbs');

    return (
      <section className={`page page--${name} ${hasBreadcrumbs && 'has-breadcrumbs'}`}>
        {this.props.children}
      </section>
    );
  }
}
