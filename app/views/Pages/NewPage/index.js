import React, { Component } from 'react'
import PropTypes from 'prop-types'
import serialize from 'form-serialize'
import { newPage } from 'actions/pageActions'
import Page from 'containers/Page'
import FieldLayout from 'containers/FieldLayout'
import Input from 'components/Input'
import Toggle from 'components/Fields/Toggle'
import TitleBar from 'components/TitleBar'
import Button from 'components/Button'
import camelcase from 'utils/camelcase'
import t from 'utils/types'

export default class NewPage extends Component {
  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    fields: t.fields.isRequired
  }

  constructor (props) {
    super(props)
    this.handleSubmit = this.handleSubmit.bind(this)
    this.handleTitleChange = this.handleTitleChange.bind(this)
  }

  state = { fields: [], title: '', homepage: false }

  handleSubmit (e) {
    e.preventDefault()
    const data = serialize(this.page.form, { hash: true })
    this.props.dispatch(newPage(data))
  }

  handleTitleChange (title) {
    this.setState({ title })
  }

  render () {
    const { fields } = this.props.fields
    const activeFields = fields.filter(f => this.state.fields.findIndex(i => f._id === i) !== -1)

    const links = [
      { label: 'Settings', path: '/settings' },
      { label: 'Pages', path: '/settings/pages' },
      { label: 'New Page', path: '/settings/pages/new' }
    ]

    return (
      <Page name="new-page" links={links} onSubmit={this.handleSubmit} ref={(r) => { this.page = r }}>
        <TitleBar title="New Page">
          <Button onClick={this.handleSubmit} small type="submit">Save</Button>
        </TitleBar>
        <div className="content">
          <div className="page__inner">
            <Input
              name="title"
              label="Title"
              ref={(r) => { this.title = r }}
              required
              full
              onChange={this.handleTitleChange}
            />

            <Input
              name="handle"
              label="Page Handle"
              instructions="You can use this handle to reference this specific page in a template."
              required
              full
              code
              disabled
              value={camelcase(this.state.title)}
            />

            <Toggle
              name="homepage"
              label="Homepage"
              instructions="Is this Page the Homepage of your website?"
              onChange={homepage => this.setState({ homepage })}
            />

            <Input
              name="template"
              label="Template"
              instructions="This is a route to the template you want to use, relative to the configured `templates` folder. Does not need to end in `.njk`."
              ref={(r) => { this.template = r }}
              required
              full
              code
            />

            {!this.state.homepage && <Input
              name="route"
              label="Route"
              instructions="What should the URL route to this page look like?"
              ref={(r) => { this.route = r }}
              required
              full
              code
              placeholder="/my-amazing-page"
            />}

            <FieldLayout
              activeFields={activeFields}
              fields={fields}
              ref={(r) => { this.fieldLayout = r }}
            />
          </div>
        </div>
      </Page>
    )
  }
}
