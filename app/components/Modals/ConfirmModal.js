import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Button from '../Button';

export default class ConfirmModal extends Component {
  static propTypes = {
    confirm: PropTypes.func.isRequired,
    close: PropTypes.func,
    message: PropTypes.string,
    small: PropTypes.bool,
  }

  static defaultProps = {
    close: null,
    message: 'Are you sure you want to do this?',
    small: false,
  }

  constructor(props) {
    super(props);
    this.confirm = this.confirm.bind(this);
    this.handleKeyPress = this.handleKeyPress.bind(this);
  }

  componentDidMount() { window.addEventListener('keyup', this.handleKeyPress); }
  componentWillUnmount() { window.removeEventListener('keyup', this.handleKeyPress); }

  handleKeyPress(e) {
    if (e.which === 13) this.confirm();
  }

  confirm() {
    this.props.confirm();
    this.props.close();
  }

  render() {
    const { close, message, small } = this.props;

    return (
      <div className="modal--confirm">
        {message}
        <div className="modal__buttons">
          <Button small={small} onClick={this.confirm}>Confirm</Button>
          <Button small={small} onClick={close} kind="subtle">Cancel</Button>
        </div>
      </div>
    );
  }
}
