import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Icon from 'utils/icons';
import './Empty.scss';

export default class Empty extends Component {
  static propTypes = { children: PropTypes.any.isRequired }

  render() {
    const { children } = this.props;

    return (
      <div className="empty">
        <div className="empty__inner">
          <Icon icon="questionMark" width={32} height={32} />
          {children}
        </div>
      </div>
    );
  }
}
