import React, { Component, PropTypes } from 'react';
import classnames from 'classnames';
import './Dropdown.scss';

export const DropdownChild = ({ children }) => <div className="dropdown__child">{children}</div>;
DropdownChild.propTypes = { children: PropTypes.any.isRequired };

export default class Dropdown extends Component {
  static propTypes = {
    name: PropTypes.string.isRequired,
    options: PropTypes.arrayOf(PropTypes.shape({
      label: PropTypes.string.isRequired,
      component: PropTypes.object,
      value: PropTypes.string.isRequired,
    })).isRequired,
    label: PropTypes.string,
    instructions: PropTypes.string,
    full: PropTypes.bool,
    defaultValue: PropTypes.string,
  }

  static defaultProps = {
    label: null,
    instructions: null,
    full: false,
    defaultValue: null,
  }

  constructor(props) {
    super(props);

    this.handleToggle = this.handleToggle.bind(this);
    this.hide = this.hide.bind(this);
    this.onClick = this.onClick.bind(this);

    this.state = {
      open: false,
      value: props.defaultValue || props.options[0].value,
    };

    this.value = props.defaultValue || props.options[0].value;
  }

  componentDidMount() { window.addEventListener('click', this.hide); }
  componentWillUnmount() { window.removeEventListener('click', this.hide); }

  onClick(value) {
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
    const { options, label, instructions, name, full } = this.props;
    const { value, open } = this.state;

    const classes = classnames(
      'dropdown',
      { 'is-open': open },
      { 'dropdown--full': full },
    );

    return (
      <div className="dropdown-wrapper form-element">
        {label && <span className="input__label">{label}</span>}
        {instructions && <p className="input__instructions">{instructions}</p>}
        <div className={classes} role="listbox" aria-expanded={open} aria-label={label || name}>
          <button
            className="dropdown__btn"
            type="button"
            onClick={this.handleToggle}
          >{options.find(opt => opt.value === value).label}</button>

          <div className="dropdown__options">
            {options.map(opt => (
              <button
                role="option"
                type="button"
                key={opt.value}
                onClick={() => this.onClick(opt.value)}
                className={value === opt.value ? 'dropdown__opt is-active' : 'dropdown__opt'}
              >{opt.component || opt.label}</button>
            ))}
          </div>
        </div>
        <input type="text" name={name} value={value} readOnly hidden />
      </div>
    );
  }
}
