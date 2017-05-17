import React, { Component, PropTypes } from 'react';
import { openModal } from 'actions/uiActions';
import Icon from 'utils/icons';
import store from 'utils/store';
import ConfirmModal from '../Modals/ConfirmModal';

export default class DeleteIcon extends Component {
  static propTypes = {
    onClick: PropTypes.func.isRequired,
    message: PropTypes.string,
    small: PropTypes.bool,
  }

  static defaultProps = {
    message: undefined,
    small: false,
  }

  constructor(props) {
    super(props);
    this.onClick = this.onClick.bind(this);
  }

  onClick() {
    const { onClick, message, small } = this.props;
    store.dispatch(openModal(
      <ConfirmModal
        confirm={onClick}
        message={message}
        small={small}
      />),
    );
  }

  render() {
    return (
      <button type="button" className="table__delete" onClick={this.onClick}><Icon icon="circleWithLine" /></button>
    );
  }
}
