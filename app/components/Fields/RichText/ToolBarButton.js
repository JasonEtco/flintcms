import React, { Component, PropTypes } from 'react';
import classnames from 'classnames';
import Icon from '../../../utils/icons';

export default class ToolBarButton extends Component {
  static propTypes = {
    active: PropTypes.bool,
    icon: PropTypes.string,
    onClick: PropTypes.func.isRequired,
    title: PropTypes.string,
  };

  static defaultProps = {
    active: false,
    icon: 'gear',
    title: null,
  }

  render() {
    const { active, onClick, icon, title } = this.props;

    const classes = classnames(
      'rich-text__editor__btn',
      { 'is-active': active },
    );

    return (
      <button
        className={classes}
        onClick={onClick}
        type="button"
        title={title}
      ><Icon icon={icon} /></button>
    );
  }
}
