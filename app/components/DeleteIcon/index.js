import React, { Component, PropTypes } from 'react';
import { openModal } from '../../actions/uiActions';
import ConfirmModal from '../Modals/ConfirmModal';
import Icon from '../../utils/icons';

export default class DeleteIcon extends Component {
  static propTypes = {
    onClick: PropTypes.func.isRequired,
    message: PropTypes.string.isRequired,
    dispatch: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
    this.onClick = this.onClick.bind(this);
  }

  onClick() {
    const { onClick, message, dispatch } = this.props;
    dispatch(openModal(
      <ConfirmModal
        confirm={onClick}
        message={message}
      />),
    );
  }

  render() {
    return (
      <button className="table__delete" onClick={this.onClick}><Icon icon="circleWithLine" /></button>
    );
  }
}
