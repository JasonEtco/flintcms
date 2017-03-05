import React, { Component, PropTypes } from 'react';
import Button from '../Button';

export default class ConfirmModal extends Component {
  static propTypes = {
    confirm: PropTypes.func.isRequired,
    close: PropTypes.func,
    message: PropTypes.string,
  }

  static defaultProps = {
    close: null,
    message: 'Are you sure you want to do this?',
  }

  constructor(props) {
    super(props);
    this.confirm = this.confirm.bind(this);
  }

  confirm() {
    this.props.confirm();
    this.props.close();
  }

  render() {
    const { close, message } = this.props;

    return (
      <div className="modal--confirm">
        {message}
        <div className="modal__buttons">
          <Button onClick={this.confirm}>Confirm</Button>
          <Button onClick={close} kind="subtle">Cancel</Button>
        </div>
      </div>
    );
  }
}
