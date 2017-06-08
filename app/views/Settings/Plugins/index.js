import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Page from 'containers/Page';
import TitleBar from 'components/TitleBar';

export default class Plugins extends Component {
  static propTypes = {
    plugins: PropTypes.shape({
      isFetching: PropTypes.bool.isRequired,
      plugins: PropTypes.arrayOf(PropTypes.shape({
        _id: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
        icon: PropTypes.shape({
          path: PropTypes.string.isRequired,
          buffer: PropTypes.string.isRequired,
        }),
      })),
    }).isRequired,
  }

  render() {
    const { plugins } = this.props;
    return (
      <Page name="plugins">
        <TitleBar title="Plugins" />
        <div className="content">
          <div className="page__inner">
            {plugins.plugins.map(plugin => (
              <div key={plugin._id}>{plugin.name}
                <img src={`data:image/png;base64,${plugin.icon.buffer}`} alt={plugin.name} />
              </div>))}
          </div>
        </div>
      </Page>
    );
  }
}
