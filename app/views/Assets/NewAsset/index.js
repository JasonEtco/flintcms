import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { newAsset } from 'actions/assetActions'
import Page from 'containers/Page'
import TitleBar from 'components/TitleBar'
import Input from 'components/Input'
import FileInput from 'components/FileInput'
import Button from 'components/Button'

export default class NewAsset extends Component {
  static propTypes = {
    dispatch: PropTypes.func.isRequired
  }

  constructor (props) {
    super(props)
    this.onSubmit = this.onSubmit.bind(this)
  }

  onSubmit (e) {
    e.preventDefault()

    if (!this.upload.asset.value) {
      // eslint-disable-next-line no-alert
      alert('Please select an image to upload')
    } else if (!this.upload.asset.value.match(/(?:gif|jpg|png|bmp|jpeg)$/)) {
      // eslint-disable-next-line no-alert
      alert('The uploaded file is not an image!')
    } else {
      const formData = new FormData()
      formData.append('title', this.title.value)
      formData.append('file', this.upload.asset.files[0], this.upload.asset.files[0].name)

      this.props.dispatch(newAsset(formData))
    }
  }

  render () {
    const links = [
      { label: 'Settings', path: '/settings' },
      { label: 'Assets', path: '/settings/assets' }
    ]

    return (
      <Page name="new-asset" links={links}>
        <TitleBar title="New Asset">
          <Button onClick={this.onSubmit} small>Save</Button>
        </TitleBar>
        <div className="content">
          <div className="page__inner">
            <form onSubmit={this.onSubmit} ref={(r) => { this.form = r }}>
              <Input
                name="title"
                label="Asset Title"
                ref={(r) => { this.title = r }}
                required
                full
              />

              <FileInput
                name="asset"
                label="Choose Asset"
                ref={(r) => { this.upload = r }}
                required
                full
              />
            </form>
          </div>
        </div>
      </Page>
    )
  }
}
