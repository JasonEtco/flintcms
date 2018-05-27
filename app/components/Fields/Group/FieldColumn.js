import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Input from 'components/Input'
import Button from 'components/Button'
import Fields from 'components/Fields'
import FieldOptions from 'components/FieldOptions'
import camelcase from 'utils/camelcase'
import { openModal } from 'actions/uiActions'
import ConfirmModal from 'components/Modals/ConfirmModal'

export default class FieldColumn extends Component {
  static propTypes = {
    field: PropTypes.object,
    onTitleChange: PropTypes.func.isRequired,
    deleteField: PropTypes.func.isRequired,
    dispatch: PropTypes.func.isRequired,
    canDelete: PropTypes.bool.isRequired,
    save: PropTypes.func.isRequired
  }

  static defaultProps = {
    field: {
      title: '',
      instructions: '',
      required: false,
      type: 'Asset'
    }
  }

  constructor (props) {
    super(props)
    this.handleTitleChange = this.handleTitleChange.bind(this)
    this.handleTypeChange = this.handleTypeChange.bind(this)
    this.delete = this.delete.bind(this)

    this.state = {
      title: props.field.title || '',
      type: props.field.type || 'Asset',
      data: props.field
    }
  }

  handleTitleChange (title) {
    this.setState({ title }, this.props.onTitleChange(title))
  }

  handleTypeChange (type) {
    this.setState({ type })
  }

  delete () {
    const { deleteField, dispatch } = this.props
    dispatch(openModal(
      <ConfirmModal
        confirm={deleteField}
        message='Are you sure you want to delete this field?'
      />)
    )
  }

  render () {
    const options = Object.keys(Fields)
      .filter(f => f !== 'Group')
      .map(n => ({ label: n, value: n }))
    const { Dropdown, Toggle } = Fields

    const { field, canDelete } = this.props

    return (
      <form className='panel__col__inner' ref={(r) => { this.form = r }} onBlur={this.props.save} onMouseLeave={this.props.save}>
        <Input
          name='title'
          label='Title'
          instructions='This is what the field will be called in the admin dashboard.'
          required
          full
          defaultValue={field.title}
          onChange={this.handleTitleChange}
          autoFocus
        />

        <Input
          name='handle'
          label='Template Handle'
          instructions='The variable to use in the templates.'
          required
          full
          code
          disabled
          value={camelcase(this.state.title)}
        />

        <Input
          name='instructions'
          label='Instructions'
          instructions='Text that will help the author understand content is being asked for.'
          defaultValue={field.instructions}
          full
        />

        <Toggle.component
          name='required'
          label='Required'
          instructions='Should this field be required?'
          defaultValue={field.required}
        />

        <Dropdown.component
          name='type'
          options={options}
          label='Field Type'
          onChange={this.handleTypeChange}
          alphabetize
          instructions='The kind of field presented in the dashboard.'
          defaultValue={field.type}
        />

        <FieldOptions
          type={this.state.type}
          onChange={this.updateField}
          fields={Fields}
        />

        {canDelete && <Button small kind='subtle' className='panel__delete' onClick={this.delete}>Delete</Button>}
      </form>
    )
  }
}
