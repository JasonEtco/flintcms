import React, { Component } from 'react'
import Page from 'containers/Page'

export default class FourOhFour extends Component {
  render () {
    return (
      <Page name='404'>
        <div className='content'>
          <div className='page__inner'>
            Page not found! Sorry!
          </div>
        </div>
      </Page>
    )
  }
}
