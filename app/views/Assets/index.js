import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';
import h from '../../utils/helpers';
import Page from '../../containers/Page';
import Table from '../../components/Table';
import TitleBar from '../../components/TitleBar';

export default class Assets extends Component {
  static propTypes = {
    assets: PropTypes.object.isRequired,
  }

  render() {
    const { assets } = this.props;

    const reduced = assets.assets.map(props => ({
      title: {
        value: props.title,
        component: <a href={`/assets/${props.filename}`} rel="noopener noreferrer" target="_blank">{props.title}</a>,
      },
      filename: props.filename,
      size: h.formatBytes(props.size, 0),
      dateCreated: {
        value: new Date(props.dateCreated).getTime(),
        component: h.formatDate(props.dateCreated),
      },
    }));

    return (
      <Page name="assets">
        <TitleBar title="Assets">
          <Link to="/admin/settings/assets/new" className="btn btn--small">New Asset</Link>
        </TitleBar>

        <div className="content">
          <div className="page__inner">
            {reduced.length > 0 ? <Table data={reduced} /> : <h3>No assets!</h3>}
          </div>
        </div>
      </Page>
    );
  }
}
