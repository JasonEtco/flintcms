import React, { Component, PropTypes } from 'react';
import { ChromePicker } from 'react-color';
import './Color.scss';

export default class Color extends Component {
  static propTypes = {
    name: PropTypes.string.isRequired,
    value: PropTypes.string,
    label: PropTypes.string,
    instructions: PropTypes.string,
  }

  static defaultProps = {
    value: '#000000',
    label: null,
    instructions: null,
  }

  constructor(props) {
    super(props);

    this.handleToggle = this.handleToggle.bind(this);
    this.hide = this.hide.bind(this);
    this.value = props.value;

    this.state = { open: false, color: props.value };
  }

  hide() {
    this.setState({ open: false });
  }

  handleToggle(e) {
    e.stopPropagation();
    this.setState({ open: !this.state.open });
  }

  handleChangeComplete = (color) => {
    this.value = color;
    this.setState({ color: color.hex });
  };

  render() {
    const { label, instructions, name } = this.props;
    const { color, open } = this.state;

    const popover = {
      position: 'absolute',
      zIndex: '2',
    };
    const cover = {
      position: 'fixed',
      top: '0px',
      right: '0px',
      bottom: '0px',
      left: '0px',
    };

    return (
      <div className="color-wrapper form-element">
        {label && <span className="input__label">{label}</span>}
        {instructions && <p className="input__instructions">{instructions}</p>}
        <button
          onClick={this.handleToggle}
          className="color__btn"
          type="button"
          style={{ backgroundColor: color }}
        />
        <div className={`color__picker ${open ? 'is-open' : ''}`}>
          <div style={popover}>
            <div style={cover} onClick={this.hide} />
            <ChromePicker
              color={color}
              onChangeComplete={this.handleChangeComplete}
            />
          </div>
        </div>

        <input type="text" name={name} value={color} readOnly hidden />
      </div>
    );
  }
}
