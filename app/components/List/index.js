import React, { Component, PropTypes } from 'react';
import Icon from '../../utils/icons';
import './List.scss';

export default class List extends Component {
  static propTypes = {
    name: PropTypes.string.isRequired,
    items: PropTypes.arrayOf(PropTypes.string),
    label: PropTypes.string,
    instructions: PropTypes.string,
  }

  static defaultProps = {
    items: [''],
    label: null,
    instructions: null,
  }

  constructor(props) {
    super(props);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.addRow = this.addRow.bind(this);
    this.removeRow = this.removeRow.bind(this);
    this.state = { items: props.items };
  }

  handleInputChange(event, i) {
    const { value } = event.target;
    const { items } = this.state;
    this.setState({ items: [
      ...items.slice(0, i),
      value,
      ...items.slice(i + 1),
    ] });
  }

  addRow() {
    const { items } = this.state;
    this.setState({ items: [...items, ''] });
  }

  removeRow(i) {
    const { items } = this.state;
    this.setState({ items: [
      ...items.slice(0, i),
      ...items.slice(i + 1),
    ] });
  }

  render() {
    const { name, label, instructions } = this.props;
    const { items } = this.state;

    return (
      <div className="list-wrapper form-element">
        {label && <label className="input__label" htmlFor={name}>{label}</label>}
        {instructions && <p className="input__instructions">{instructions}</p>}
        <table className="list__table">
          <tbody>
            {items.map((item, i) => ( // eslint-disable-next-line react/no-array-index-key
              <tr key={i} className="list__table__row">
                <td className="list__table__cell">
                  <input className="list__table__cell__input" onChange={e => this.handleInputChange(e, i)} value={item} />
                </td>
                <td className="list__table__cell list__table__cell--remove">
                  <button onClick={() => this.removeRow(i)} className="list__table__cell__btn" type="button">
                    <Icon width={9} height={9} icon="cross" />
                  </button>
                </td>
              </tr>))}
          </tbody>
        </table>

        <button className="list__btn" type="button" onClick={this.addRow}>Add Row <Icon icon="plus" width={9} height={9} /></button>
        {items.map((item, i) => <input key={item} type="text" hidden readOnly value={item} name={`${name}[${i}]`} />)}
      </div>
    );
  }
}
