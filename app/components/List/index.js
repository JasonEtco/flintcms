import React, { Component, PropTypes } from 'react';

export default class List extends Component {
  static propTypes = {
    name: PropTypes.string.isRequired,
    items: PropTypes.arrayOf(PropTypes.string),
    label: PropTypes.string,
    instructions: PropTypes.string,
  }

  static defaultProps = {
    items: [],
    label: null,
    instructions: null,
  }

  constructor(props) {
    super(props);
    this.handleKeyPress = this.handleKeyPress.bind(this);
    this.state = { items: props.items };
  }

  handleKeyPress(e) {
    if (e.which === 13) {
      e.preventDefault();
      const { items } = this.state;
      const { value } = e.target;

      if (items.indexOf(value) === -1) {
        this.setState({ items: [...this.state.items, e.target.value] });
      }
      e.target.value = ''; // eslint-disable-line no-param-reassign
    }
  }

  render() {
    const { name, label, instructions } = this.props;
    const { items } = this.state;

    return (
      <div className="list-wrapper form-element">
        {label && <label className="input__label" htmlFor={name}>{label}</label>}
        {instructions && <p className="input__instructions">{instructions}</p>}
        <table>
          <tbody>
            {items.map(item => <tr key={item}><td>{item}</td></tr>)}
          </tbody>
        </table>

        <input type="text" onKeyPress={e => this.handleKeyPress(e)} />
        {items.map((item, i) => <input key={item} type="text" hidden readOnly value={item} name={`${name}[${i}]`} />)}
      </div>
    );
  }
}
