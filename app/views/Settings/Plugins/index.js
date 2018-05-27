import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Page from 'containers/Page'
import TitleBar from 'components/TitleBar'
import Table from 'components/Table'

export default class Plugins extends Component {
  static propTypes = {
    plugins: PropTypes.shape({
      isFetching: PropTypes.bool.isRequired,
      plugins: PropTypes.arrayOf(PropTypes.shape({
        _id: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
        icon: PropTypes.shape({
          path: PropTypes.string.isRequired,
          buffer: PropTypes.string.isRequired
        })
      }))
    }).isRequired
  }

  render () {
    const { plugins } = this.props
    const data = plugins.plugins.map(plugin => ({
      key: plugin._id,
      image: {
        sortBy: false,
        component: <img src={`data:image/png;base64,${plugin.icon.buffer}`} alt={plugin.title} />
      },
      title: plugin.title
    }))

    return (
      <Page name="plugins">
        <TitleBar title="Plugins" />
        <div className="content">
          <div className="page__inner">
            <Table data={data} sortBy="dateCreated" showSearch={false} />
          </div>
        </div>
      </Page>
    )
  }
}
