import React, { Component, PropTypes } from 'react';
import classnames from 'classnames';
import { deleteToast } from 'actions/uiActions';
import './Toast.scss';

export default class Toast extends Component {
  static propTypes = {
    message: PropTypes.oneOfType([PropTypes.string, PropTypes.element]).isRequired,
    style: PropTypes.oneOf(['default', 'success', 'error']),
    dateCreated: PropTypes.number.isRequired,
    dispatch: PropTypes.func.isRequired,
  }

  static defaultProps = {
    style: 'default',
  }

  constructor(props) {
    super(props);
    this.transitionEnd = this.transitionEnd.bind(this);
  }

  state = { leaving: false, entering: true }

  componentDidMount() {
    setTimeout(() => this.setState({ entering: false }), 0);

    setTimeout(() => {
      this.setState({ leaving: true });
    }, 6000);
  }

  transitionEnd(e) {
    if (e.propertyName === 'height' && this.state.leaving) {
      this.props.dispatch(deleteToast(this.props.dateCreated));
    }

    if (this.state.entering) {
      this.setState({ entering: false });
    }
  }

  render() {
    const { style, message } = this.props;

    const classes = classnames(
      'toasts__toast',
      `toasts__toast--${style}`,
      { 'toasts__toast--leaving': this.state.leaving },
      { 'toasts__toast--entering': this.state.entering },
    );

    return (
      <div className={classes} onTransitionEnd={this.transitionEnd}>
        {message}
      </div>
    );
  }
}
