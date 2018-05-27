import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Icon from 'utils/icons'
import './List.scss'

export default class List extends Component {
  static propTypes = {
    name: PropTypes.string.isRequired,
    options: PropTypes.arrayOf(PropTypes.string),
    label: PropTypes.string,
    instructions: PropTypes.string
  }

  static defaultProps = {
    options: [''],
    label: null,
    instructions: null
  }

  constructor (props) {
    super(props)
    this.handleInputChange = this.handleInputChange.bind(this)
    this.handleKeyPress = this.handleKeyPress.bind(this)
    this.addRow = this.addRow.bind(this)
    this.removeRow = this.removeRow.bind(this)
    this.state = { options: props.options }
  }

  handleKeyPress (e) {
    if (e.which === 13) {
      e.preventDefault()
      if (e.target.value !== '') this.addRow()
    }
  }

  handleInputChange (event, i, target) {
    const { value } = event.target
    const { options } = this.state
    this.setState({ options: [
      ...options.slice(0, i),
      { ...options[i], [target]: value },
      ...options.slice(i + 1)
    ] })
  }

  addRow () {
    const { options } = this.state
    this.setState({ options: [...options, ''] }, () => {
      this[`input--${options.length}`].focus()
    })
  }

  removeRow (i) {
    const { options } = this.state
    this.setState({ options: [
      ...options.slice(0, i),
      ...options.slice(i + 1)
    ] })
  }

  render () {
    const { name, label, instructions } = this.props
    const { options } = this.state

    return (
      <div className="list-wrapper form-element">
        {label && <label className="input__label" htmlFor={name}>{label}</label>}
        {instructions && <p className="input__instructions">{instructions}</p>}
        <table className="list__table">
          <thead>
            <tr>
              <th className="list__table__head">Label</th>
              <th className="list__table__head">Value</th>
              <th className="list__table__head" />
            </tr>
          </thead>
          <tbody>
            {options.map((item, i) => ( // eslint-disable-next-line react/no-array-index-key
              <tr key={i} className="list__table__row">
                <td className="list__table__cell">
                  <input
                    ref={(r) => { this[`input--${i}`] = r }}
                    className="list__table__cell__input"
                    onKeyPress={this.handleKeyPress}
                    onChange={e => this.handleInputChange(e, i, 'label')}
                    value={item.label}
                  />
                </td>
                <td className="list__table__cell">
                  <input
                    className="list__table__cell__input"
                    onKeyPress={this.handleKeyPress}
                    onChange={e => this.handleInputChange(e, i, 'value')}
                    value={item.value}
                  />
                </td>
                <td className="list__table__cell list__table__cell--remove">
                  <button onClick={() => this.removeRow(i)} className="list__table__cell__btn" type="button">
                    <Icon width={9} height={9} icon="cross" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <button className="list__btn" type="button" onClick={this.addRow}>Add Row <Icon icon="plus" width={9} height={9} /></button>
        {options.map((item, i) => (
          <div key={item.value || i}>
            <input type="text" hidden readOnly value={item.label} name={`${name}[${i}][label]`} />
            <input type="text" hidden readOnly value={item.value} name={`${name}[${i}][value]`} />
          </div>
        ))}
      </div>
    )
  }
}
