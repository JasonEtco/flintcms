import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { truncate } from 'utils/helpers';
import './TitleBar.scss';

export default class TitleBar extends Component {
  static propTypes = {
    title: PropTypes.string.isRequired,
    children: PropTypes.any,
  }

  static defaultProps = {
    children: null,
  }

  render() {
    const { title, children } = this.props;
    return (
      <header className="title-bar">
        <h1 className="title-bar__title">{truncate(title, 40)}</h1>
        <div className="title-bar__children">
          {children}
        </div>
      </header>
    );
  }
}
