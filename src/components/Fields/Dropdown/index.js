import React, { Component, PropTypes } from 'react';
import './Dropdown.scss';

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

    this.value = props.options[0].value;
  }

  onClick(value) {
    this.value = value;
    this.setState({ value, open: false });
  }

  handleToggle() {
    this.setState({ open: !this.state.open });
  }

  render() {
    const { options } = this.props;
    const { value, open } = this.state;

    return (
      <div className={open ? 'dropdown is-open' : 'dropdown'}>
        <button className="dropdown__btn" type="button" onClick={this.handleToggle}>{options.find(opt => opt.value === value).label}</button>

        <div className="dropdown__options">
          {options.map(opt => (
            <button
              type="button"
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
