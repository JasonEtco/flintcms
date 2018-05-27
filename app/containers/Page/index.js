import React, { Component } from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'
import Breadcrumbs from 'components/Breadcrumbs'
import Footer from 'containers/Footer'
import './Page.scss'

export default class Page extends Component {
  static propTypes = {
    children: PropTypes.oneOfType([
      PropTypes.arrayOf(PropTypes.node),
      PropTypes.node
    ]).isRequired,
    links: PropTypes.arrayOf(PropTypes.shape({
      label: PropTypes.string.isRequired,
      path: PropTypes.string.isRequired
    })),
    name: PropTypes.string.isRequired,
    onSubmit: PropTypes.func
  };

  static defaultProps = {
    links: null,
    onSubmit: null
  };

  render () {
    const { name, children, links, onSubmit } = this.props
    const classes = classnames(
      'page',
      `page--${name}`,
      { 'page--form': onSubmit },
      { 'has-breadcrumbs': links && links.length > 0 }
    )

    if (onSubmit) {
      return (
        <form className={classes} onSubmit={onSubmit} ref={(r) => { this.form = r }}>
          {links && <Breadcrumbs links={links} />}
          {children}

          <Footer />
        </form>
      )
    }

    return (
      <section className={classes}>
        {links && <Breadcrumbs links={links} />}
        {children}

        <Footer />
      </section>
    )
  }
}
