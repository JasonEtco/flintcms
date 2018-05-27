import React, { Component } from 'react'
import PropTypes from 'prop-types'
import serialize from 'form-serialize'
import t from 'utils/types'
import renderOption from 'utils/renderOption'
import getUserPermissions from 'utils/getUserPermissions'
import validateFields from 'utils/validateFields'
import Page from 'containers/Page'
import TitleBar from 'components/TitleBar'
import Button from 'components/Button'
import Input from 'components/Input'
import Aside from 'containers/Aside'
import { deleteEntry, updateEntry, entryDetails } from 'actions/entryActions'
import { openModal } from 'actions/uiActions'
import ConfirmModal from 'components/Modals/ConfirmModal'
import { withRouter } from 'react-router'

export default withRouter(class Entry extends Component {
  static propTypes = {
    entries: t.entries.isRequired,
    user: t.user.isRequired,
    fields: t.fields.isRequired,
    sections: t.sections.isRequired,
    match: PropTypes.shape({
      params: PropTypes.shape({
        id: PropTypes.string.isRequired
      }).isRequired
    }).isRequired,
    dispatch: PropTypes.func.isRequired
  }

  constructor (props) {
    super(props)
    this.renderFields = this.renderFields.bind(this)
    this.deleteEntry = this.deleteEntry.bind(this)
    this.onSubmit = this.onSubmit.bind(this)
  }

  state = { status: null }

  componentDidMount () {
    const { dispatch, match, entries } = this.props
    const { full } = entries.entries.find(e => e._id === match.params.id)
    if (!full || full === undefined) {
      dispatch(entryDetails(match.params.id))
    }
  }

  onSubmit (e) {
    e.preventDefault()
    const { match, dispatch } = this.props
    const data = serialize(this.page.form, { hash: true })
    const { title, status, dateCreated, ...fields } = data

    const invalidFields = validateFields(fields)
    if (invalidFields.length !== 0) return

    dispatch(updateEntry(match.params.id, data))
  }

  deleteEntry () {
    const { match, dispatch } = this.props
    dispatch(openModal(
      <ConfirmModal
        confirm={() => dispatch(deleteEntry(match.params.id, true))}
        message={'Are you sure you want to delete this entry?'}
      />)
    )
  }

  renderFields (entryFields, fieldId, canEdit) {
    const { fields } = this.props.fields
    const foundField = fields.find(f => f._id === fieldId)
    const entryField = entryFields.find(f => f.fieldId === fieldId)

    return renderOption(foundField, entryField ? entryField.value : null, {
      disabled: !canEdit
    })
  }

  render () {
    const { sections, match, entries, user } = this.props

    const {
      section,
      title,
      _id,
      full,
      status,
      fields,
      author,
      dateCreated
    } = entries.entries.find(e => e._id === match.params.id)

    // TODO: Render loader
    if (full === undefined) return null

    const sectionObj = sections.sections.find(s => s._id === section)

    const links = [
      { label: 'Entries', path: '/entries' },
      { label: sectionObj.title, path: `/entries/${sectionObj.slug}` },
      { label: title, path: `/entries/${sectionObj.slug}/${_id}` }
    ]

    const { canEditOthersEntries, canDeleteEntries } = getUserPermissions().entries
    const canEdit = canEditOthersEntries || user._id === author

    return (
      <Page name="entry" links={links} onSubmit={this.onSubmit} ref={(r) => { this.page = r }}>
        <TitleBar title={title}>
          {canEdit && <Button small onClick={this.Submit} type="submit">Save Entry</Button>}
          {canDeleteEntries && <Button small onClick={this.deleteEntry}>Delete Entry</Button>}
        </TitleBar>
        <div className="content">
          <div className="page__inner">
            <Input label="Title" defaultValue={title} name="title" full required disabled={!canEdit} />
            {sectionObj.fields.map(fieldId => this.renderFields(fields, fieldId, canEdit))}
          </div>

          <Aside status={status} dateCreated={dateCreated} disabled={!canEdit} />
        </div>
      </Page>
    )
  }
})
