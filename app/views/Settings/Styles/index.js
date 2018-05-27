import React, { Component } from 'react'
import PropTypes from 'prop-types'
import CodeMirror from 'react-codemirror'
import 'codemirror/mode/css/css'
import { updateSite } from 'actions/siteActions'
import Page from 'containers/Page'
import TitleBar from 'components/TitleBar'
import Button from 'components/Button'
import './CodeMirror.scss'
import './Styles.scss'

export default class Styles extends Component {
  static propTypes = {
    site: PropTypes.shape({
      style: PropTypes.string
    }).isRequired,
    dispatch: PropTypes.func.isRequired
  }

  constructor (props) {
    super(props)
    this.canSave = this.canSave.bind(this)
    this.saveFile = this.saveFile.bind(this)
    this.updateCode = this.updateCode.bind(this)

    this.state = { canSave: false, contents: props.site.style }
  }

  canSave (canSave) {
    this.setState({ canSave })
  }

  saveFile (e) {
    e.preventDefault()
    const { dispatch } = this.props
    dispatch(updateSite({ style: this.state.contents }))
  }

  updateCode (contents) {
    const { style } = this.props.site
    if (contents !== style) {
      this.canSave(true)
    } else {
      this.canSave(false)
    }

    this.setState({ contents })
  }

  render () {
    const { canSave, contents } = this.state

    const options = {
      mode: 'css',
      lineNumbers: true,
      indentUnit: 4,
      indentWithTabs: true
    }

    const links = [
      { label: 'Settings', path: '/settings' },
      { label: 'Custom Styles', path: '/settings/styles' }
    ]

    return (
      <Page name='styles' links={links} onSubmit={this.saveFile}>
        <TitleBar title='Custom Styles'>
          <Button small type='submit' disabled={!canSave}>Save changes</Button>
        </TitleBar>
        <div className='content'>
          <div className='page__inner'>
            <p className='input__instructions'>You can use this area to write custom styles that will be useable in every template. You can use the <code>{'{{ flint.site.style }}'}</code> tag to render the styles you write below into your templates.</p>
            <div className='style-editor__editor'>
              <CodeMirror value={contents} onChange={this.updateCode} options={options} />
            </div>
          </div>
        </div>
      </Page>
    )
  }
}
