import React, { Component, PropTypes } from 'react';

export default class Dropdown extends Component {
  static propTypes = {
    options: PropTypes.arrayOf(PropTypes.shape({
      label: PropTypes.string.isRequired,
      value: PropTypes.string.isRequired,
    })).isRequired,
  }

  constructor(props) {
    super(props);

    this.handleToggle = this.handleToggle.bind(this);
    this.onClick = this.onClick.bind(this);

    this.state = {
      open: false,
      value: props.options[0].value,
    };
  }

  onClick(value) {
    this.setState({ value });
  }

  handleToggle() {
    this.setState({ open: !this.state.open });
  }

  render() {
    const { options } = this.props;
    const { value } = this.state;

    return (
      <div className="dropdown">
        <button onClick={this.handleToggle}>{value}</button>

        <div className="dropdown__options">
          {options.map(opt => (
            <button
              key={opt.value}
              onClick={() => this.onClick(opt.value)}
              className={value === opt.value ? 'dropdown__opt is-active' : 'dropdown__opt'}
            >{opt.label}</button>
          ))}
        </div>
      </div>
    );
  }
}
