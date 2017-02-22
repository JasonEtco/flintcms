import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';
import moment from 'moment';
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
      title: props.title,
      filename: props.filename,
      dateCreated: moment(new Date(props.dateCreated)).format('DD/MM/YYYY'),
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
