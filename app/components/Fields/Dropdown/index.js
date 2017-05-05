import React, { Component, PropTypes } from 'react';
import classnames from 'classnames';
import './Dropdown.scss';

const { string, arrayOf, oneOfType, shape, object, bool, func, any } = PropTypes;

export const DropdownChild = ({ children }) => <div className="dropdown__child">{children}</div>;
DropdownChild.propTypes = { children: any.isRequired };

export default class Dropdown extends Component {
  static propTypes = {
    name: string.isRequired,
    options: oneOfType([
      arrayOf(shape({
        label: string.isRequired,
        component: object,
        value: string.isRequired,
      })),
      arrayOf(string),
    ]).isRequired,
    label: string,
    instructions: string,
    full: bool,
    defaultValue: string,
    onChange: func,
    children: any,
  }

  static defaultProps = {
    label: null,
    instructions: null,
    full: false,
    defaultValue: null,
    onChange: f => f,
    children: null,
  }

  constructor(props) {
    super(props);

    this.handleToggle = this.handleToggle.bind(this);
    this.hide = this.hide.bind(this);
    this.onClick = this.onClick.bind(this);

    const value = props.defaultValue || props.options[0].value || props.options[0];
    this.state = {
      open: false,
      value,
    };

    this.value = value;
  }

  componentDidMount() { window.addEventListener('click', this.hide); }
  componentWillUnmount() { window.removeEventListener('click', this.hide); }

  onClick(value) {
    this.props.onChange(value);
    this.value = value;
    this.setState({ value, open: false });
  }

  hide() {
    this.setState({ open: false });
  }

  handleToggle(e) {
    e.stopPropagation();
    this.setState({ open: !this.state.open });
  }

  render() {
    const { options, label, instructions, name, full, children } = this.props;
    const { value, open } = this.state;

    const classes = classnames(
      'dropdown',
      { 'is-open': open },
      { 'dropdown--full': full },
    );

    const dropper = (
      <div className={classes} role="listbox" aria-expanded={open} aria-label={label || name}>
        <button
          className="dropdown__btn"
          type="button"
          onClick={this.handleToggle}
        >{typeof options[0] === 'string' ? value : options.find(opt => opt.value === value).label}</button>

        <div className="dropdown__options">
          {options.map(opt => (
            <button
              role="option"
              type="button"
              key={opt.value || opt}
              onClick={() => this.onClick(opt.value || opt)}
              className={value === opt.value ? 'dropdown__opt is-active' : 'dropdown__opt'}
            >{opt.component || opt.label || opt}</button>
          ))}
        </div>
      </div>
    );

    return (
      <div className="dropdown-wrapper form-element">
        {label && <span className="input__label">{label}</span>}
        {instructions && <p className="input__instructions">{instructions}</p>}
        {children ? <div className="dropdown__inner">{dropper}{children}</div> : dropper}
        <input type="text" name={name} value={value} readOnly hidden />
      </div>
    );
  }
}
