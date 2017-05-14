import React, { Component, PropTypes } from 'react';
import Input from 'components/Input';
import Button from 'components/Button';
import { slugify } from 'utils/helpers';

export default class NewBlockModal extends Component {
  static propTypes = {
    confirm: PropTypes.func.isRequired,
    close: PropTypes.func,
  }

  static defaultProps = {
    close: null,
  }

  constructor(props) {
    super(props);
    this.confirm = this.confirm.bind(this);
    this.handleTitleChange = this.handleTitleChange.bind(this);
    this.handleKeyPress = this.handleKeyPress.bind(this);
  }

  state = { title: '' }

  confirm() {
    this.props.confirm({
      name: this.name.value,
      handle: slugify(this.state.title),
      fields: [{
        label: 'Blank',
        handle: 'blank-0',
      }],
    });
    this.props.close();
  }

  handleTitleChange(title) {
    this.setState({ title });
  }

  handleKeyPress(e) {
    if (e.key === 'Enter') this.confirm();
  }

  render() {
    const { close } = this.props;

    return (
      <div className="modal--newblock">
        <Input
          name="name"
          label="Name"
          required
          ref={(r) => { this.name = r; }}
          instructions="What this block will be called in the dashboard."
          onChange={this.handleTitleChange}
          full
          autoFocus
          onKeyPress={this.handleKeyPress}
        />
        <Input
          name="handle"
          label="Handle"
          required
          readOnly
          ref={(r) => { this.handle = r; }}
          instructions="How you'll refer to this block type in your templates."
          full
          code
          value={slugify(this.state.title)}
        />
        <div className="modal__buttons">
          <Button small onClick={this.confirm}>Confirm</Button>
          <Button small onClick={close} kind="subtle">Cancel</Button>
        </div>
      </div>
    );
  }
}
