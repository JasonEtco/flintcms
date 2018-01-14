import React, { Component } from 'react'
import PropTypes from 'prop-types'
import serialize from 'form-serialize'
import Page from 'containers/Page'
import FieldLayout from 'containers/FieldLayout'
import Input from 'components/Input'
import Toggle from 'components/Fields/Toggle'
import TitleBar from 'components/TitleBar'
import Button from 'components/Button'
import { updatePageSettings } from 'actions/pageActions'
import t from 'utils/types'
import { withRouter } from 'react-router'

export default withRouter(class SettingsPage extends Component {
  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    fields: t.fields.isRequired,
    pages: t.pages.isRequired,
    match: PropTypes.shape({
      params: PropTypes.shape({
        slug: PropTypes.string.isRequired
      }).isRequired
    }).isRequired
  }

  constructor (props) {
    super(props)

    const { pages, match } = props
    const { slug } = match.params
    this.page = pages.pages.find(e => e.slug === slug)

    this.handleSubmit = this.handleSubmit.bind(this)
    this.toggleField = this.toggleField.bind(this)

    this.state = { fields: this.page.fieldLayout, title: '', homepage: this.page.homepage }
  }

  handleSubmit (e) {
    e.preventDefault()
    const { dispatch } = this.props
    const data = serialize(this.pagewrapper.form, { hash: true })
    dispatch(updatePageSettings(this.page._id, data))
  }

  toggleField (id) {
    const { fields } = this.state
    const index = fields.indexOf(id)
    if (index !== -1) {
      this.setState({ fields: [...fields.slice(0, index), ...fields.slice(index + 1)] })
    } else {
      this.setState({ fields: [...fields, id] })
    }
  }

  render () {
    const { fields } = this.props.fields
    const activeFields = fields.filter(f => this.state.fields.findIndex(i => f._id === i) !== -1)

    const links = [
      { label: 'Settings', path: '/settings' },
      { label: 'Pages', path: '/settings/pages' },
      { label: this.page.title, path: `/settings/pages/${this.page.slug}` }
    ]

    return (
      <Page name='page' onSubmit={this.handleSubmit} ref={(r) => { this.pagewrapper = r }} links={links}>
        <TitleBar title={this.page.title}>
          <Button type='submit' small>Save Page</Button>
        </TitleBar>
        <div className='content'>
          <div className='page__inner'>
            <Input
              name='title'
              label='Title'
              ref={(r) => { this.title = r }}
              required
              full
              defaultValue={this.page.title}
            />

            <Input
              name='handle'
              label='Page Handle'
              instructions='You can use this handle to reference this specific page in a template.'
              required
              full
              code
              disableds
              value={this.page.handle}
            />

            <Toggle
              name='homepage'
              label='Homepage'
              instructions='Is this page the Homepage of your website?'
              defaultValue={this.page.homepage}
              onChange={homepage => this.setState({ homepage })}
            />

            <Input
              name='template'
              label='Template'
              instructions='This is a route to the template you want to use, relative to the configured `templates` folder. Does not need to end in `.njk`.'
              ref={(r) => { this.template = r }}
              required
              full
              code
              defaultValue={this.page.template}
            />

            {!this.state.homepage && <Input
              name='route'
              label='Route'
              instructions='What should the URL route to this page look like?'
              ref={(r) => { this.route = r }}
              required
              full
              code
              placeholder='/my-amazing-page'
              defaultValue={this.page.route}
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
})
