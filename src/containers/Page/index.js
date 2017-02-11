import React, { Component, PropTypes } from 'react';
import './Page.scss';
import Breadcrumbs from '../../components/Breadcrumbs';
import Footer from '../Footer';

export default class Page extends Component {
  static propTypes = {
    children: React.PropTypes.oneOfType([
      React.PropTypes.arrayOf(React.PropTypes.node),
      React.PropTypes.node,
    ]),
    links: PropTypes.arrayOf(PropTypes.shape({
      label: PropTypes.string.isRequired,
      path: PropTypes.string.isRequired,
    })),
    name: PropTypes.string.isRequired,
  };

  static defaultProps = {
    children: null,
    links: null,
  };

  render() {
    const { name, children, links } = this.props;

    return (
      <section className={`page page--${name} ${links && 'has-breadcrumbs'}`}>
        {links && <Breadcrumbs links={links} />}
        {children}
        
        <Footer />
      </section>
    );
  }
}
