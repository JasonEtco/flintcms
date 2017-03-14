import React, { Component, PropTypes } from 'react';
import classnames from 'classnames';
import './Page.scss';
import Breadcrumbs from '../../components/Breadcrumbs';
import Footer from '../Footer';

export default class Page extends Component {
  static propTypes = {
    children: React.PropTypes.oneOfType([
      React.PropTypes.arrayOf(React.PropTypes.node),
      React.PropTypes.node,
    ]).isRequired,
    links: PropTypes.arrayOf(PropTypes.shape({
      label: PropTypes.string.isRequired,
      path: PropTypes.string.isRequired,
    })),
    name: PropTypes.string.isRequired,
    onSubmit: PropTypes.func,
  };

  static defaultProps = {
    links: null,
    onSubmit: null,
  };

  render() {
    const { name, children, links, onSubmit } = this.props;
    const classes = classnames(
      'page',
      { [`page--${name}`]: true },
      { 'has-form': onSubmit },
      { 'has-breadcrumbs': links && links.length > 0 },
    );

    let content = children;
    if (onSubmit) {
      content = <form className="page__form" onSubmit={onSubmit} ref={(r) => { this.form = r; }}>{children}</form>;
    }

    return (
      <section className={classes}>
        {links && <Breadcrumbs links={links} />}
        {content}

        <Footer />
      </section>
    );
  }
}
