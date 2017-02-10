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

  constructor(props) {
    super(props);

    this.hasBreadcrumbs = React.Children
      .toArray(props.children)
      .some(child => child.type && child.type.displayName === 'Breadcrumbs');
  }

  render() {
    const { name, children } = this.props;

    return (
      <section className={`page page--${name} ${this.hasBreadcrumbs && 'has-breadcrumbs'}`}>
        {children}
      </section>
    );
  }
}
