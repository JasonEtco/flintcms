import React, { Component, PropTypes } from 'react';
import classnames from 'classnames';
import Icon from '../../utils/icons';
import { closeModals } from '../../actions/uiActions';
import './Modals.scss';

export default class Modals extends Component {
  static propTypes = {
    ui: PropTypes.object.isRequired,
    dispatch: PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props);
    this.handleKeypress = this.handleKeypress.bind(this);
    this.closeModals = this.closeModals.bind(this);
  }

  componentDidMount() { document.addEventListener('keydown', this.handleKeypress); }
  componentWillUnmount() { document.removeEventListener('keydown', this.handleKeypress); }

  handleKeypress(e) {
    if (e.keyCode === 27) {
      this.props.dispatch(closeModals());
    }
  }

  closeModals() {
    this.props.dispatch(closeModals());
  }

  render() {
    const { currentModal, modalIsOpen } = this.props.ui;

    if (currentModal === null || modalIsOpen === false) return false;

    const modalClasses = classnames(
      'modal-wrapper',
      { 'modal-wrapper--full': currentModal.props.full },
      { 'is-active': modalIsOpen },
    );

    return (
      <div className={modalClasses}>
        <div className="modal" style={{ zIndex: 9999 }}>
          <button className="modal__close" onClick={this.closeModals}><Icon icon="cross" width={14} height={14} /></button>
          {React.cloneElement(currentModal, { close: () => this.closeModals() })}
        </div>

        <div // eslint-disable-line
          className="modal-overlay"
          onClick={this.closeModals}
        />
      </div>
    );
  }
}
