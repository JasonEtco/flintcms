import React, { Component, PropTypes } from 'react';
import classnames from 'classnames';
import { deleteToast } from '../../actions/uiActions';
import './Toast.scss';

export default class Toast extends Component {
  static propTypes = {
    message: PropTypes.string.isRequired,
    style: PropTypes.oneOf(['default', 'success', 'error']).isRequired,
    dateCreated: PropTypes.number.isRequired,
    dispatch: PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props);
    this.transitionEnd = this.transitionEnd.bind(this);
  }

  state = { leaving: false }

  componentDidMount() {
    setTimeout(() => {
      this.setState({ leaving: true });
    }, 6000);
  }

  transitionEnd(e) {
    if (e.propertyName === 'height' && this.state.leaving) {
      this.props.dispatch(deleteToast(this.props.dateCreated));
    }
  }

  render() {
    const { style, message } = this.props;

    const classes = classnames(
      'toasts__toast',
      `toasts__toast--${style}`,
      { 'toasts__toast--leaving': this.state.leaving },
    );

    return (
      <div className={classes} onTransitionEnd={this.transitionEnd}>
        {message}
      </div>
    );
  }
}
